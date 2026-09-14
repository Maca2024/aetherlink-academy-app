import { randomUUID } from 'node:crypto';
import { Redis, type RedisInstance } from '@hocuspocus/extension-redis';

// Echo filtering only needs per-process uniqueness; hostnames and pids can collide across containers.
export const CANONICAL_CHANGE_INSTANCE_ID = `pid-${process.pid}-${randomUUID()}`;

export type CanonicalChangeMessage = {
  slug: string;
  epoch: number | null;
  version: number;
  instanceId: string;
  pid: number;
};

type CanonicalChangeHandler = (message: CanonicalChangeMessage) => void | Promise<void>;

const canonicalChangeHandlers = new Set<CanonicalChangeHandler>();
let canonicalPublisher: RedisInstance | null = null;
let canonicalSubscriber: RedisInstance | null = null;
let canonicalChangeChannel: string | null = null;

function disconnectCanonicalChangeClients(): void {
  canonicalPublisher?.disconnect();
  canonicalSubscriber?.disconnect();
  canonicalPublisher = null;
  canonicalSubscriber = null;
  canonicalChangeChannel = null;
}

class SharedRedis extends Redis {
  async onStoreDocument(): Promise<void> {
    // PostgreSQL locks and merges each document; Redis must never skip a durable write.
  }

  async onDestroy(): Promise<void> {
    await super.onDestroy();
    disconnectCanonicalChangeClients();
  }
}

function getSharedRedisConfiguration(): {
  host: string;
  port: number;
  prefix: string;
  options: {
    username?: string;
    password: string;
    tls: { rejectUnauthorized: true; servername: string };
    connectTimeout: number;
    maxRetriesPerRequest: number;
  };
} | null {
  const raw = process.env.REDIS_URL || process.env.KV_URL;
  if (!raw) {
    if (process.env.VERCEL) throw new Error('Shared Redis is required on Vercel');
    return null;
  }
  const url = new URL(raw);
  if (url.protocol !== 'rediss:') throw new Error('Proof Redis requires TLS');
  return {
    host: url.hostname,
    port: Number(url.port || 6379),
    prefix: process.env.PROOF_REDIS_PREFIX || `proof:${process.env.PROOF_DATABASE_SCHEMA || 'proof'}`,
    options: {
      username: url.username ? decodeURIComponent(url.username) : undefined,
      password: decodeURIComponent(url.password),
      tls: { rejectUnauthorized: true, servername: url.hostname },
      connectTimeout: 10000,
      maxRetriesPerRequest: 2,
    },
  };
}

function handleCanonicalChange(raw: string): void {
  try {
    const message = JSON.parse(raw) as Partial<CanonicalChangeMessage>;
    if (
      typeof message.slug !== 'string'
      || !message.slug.trim()
      || (message.epoch !== null && typeof message.epoch !== 'number')
      || typeof message.version !== 'number'
      || typeof message.instanceId !== 'string'
      || !message.instanceId.trim()
      || typeof message.pid !== 'number'
    ) return;
    for (const handler of canonicalChangeHandlers) {
      void Promise.resolve(handler(message as CanonicalChangeMessage)).catch((error) => {
        console.error('[collab] canonical change handler failed', { slug: message.slug, error });
      });
    }
  } catch {
    console.warn('[collab] ignored malformed canonical change message');
  }
}

export function subscribeToCanonicalChanges(handler: CanonicalChangeHandler): () => void {
  canonicalChangeHandlers.add(handler);
  return () => canonicalChangeHandlers.delete(handler);
}

export async function publishCanonicalChange(message: CanonicalChangeMessage): Promise<void> {
  if (!canonicalPublisher || !canonicalChangeChannel) return;
  try {
    await canonicalPublisher.publish(canonicalChangeChannel, JSON.stringify(message));
  } catch (error) {
    console.error('[collab] canonical change publish failed', { slug: message.slug, error });
  }
}

export async function createSharedRedisExtensions(): Promise<SharedRedis[]> {
  const configuration = getSharedRedisConfiguration();
  if (!configuration) return [];
  disconnectCanonicalChangeClients();
  const extension = new SharedRedis(configuration);
  const publisher = extension.pub.duplicate();
  const subscriber = extension.sub.duplicate();
  const channel = `${configuration.prefix}:canonical-changed`;
  extension.pub.on('error', () => console.error('[collab] Redis publisher unavailable'));
  extension.sub.on('error', () => console.error('[collab] Redis subscriber unavailable'));
  publisher.on('error', () => console.error('[collab] canonical change publisher unavailable'));
  subscriber.on('error', () => console.error('[collab] canonical change subscriber unavailable'));
  subscriber.on('message', (receivedChannel, message) => {
    if (receivedChannel === channel) handleCanonicalChange(message);
  });
  try {
    await Promise.all([extension.pub.ping(), extension.sub.ping(), publisher.ping(), subscriber.ping()]);
    await subscriber.subscribe(channel);
    canonicalPublisher = publisher;
    canonicalSubscriber = subscriber;
    canonicalChangeChannel = channel;
    return [extension];
  } catch {
    extension.pub.disconnect();
    extension.sub.disconnect();
    publisher.disconnect();
    subscriber.disconnect();
    throw new Error('Proof shared Redis could not connect');
  }
}
