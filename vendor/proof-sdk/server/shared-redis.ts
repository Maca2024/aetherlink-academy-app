import { Redis } from '@hocuspocus/extension-redis';

class SharedRedis extends Redis {
  async onStoreDocument(): Promise<void> {
    // PostgreSQL locks and merges each document; Redis must never skip a durable write.
  }

  async afterStoreDocument(): Promise<void> {}
}

export async function createSharedRedisExtensions(): Promise<SharedRedis[]> {
  const raw = process.env.REDIS_URL || process.env.KV_URL;
  if (!raw) {
    if (process.env.VERCEL) throw new Error('Shared Redis is required on Vercel');
    return [];
  }
  const url = new URL(raw);
  if (url.protocol !== 'rediss:') throw new Error('Proof Redis requires TLS');
  const extension = new SharedRedis({
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
  });
  extension.pub.on('error', () => console.error('[collab] Redis publisher unavailable'));
  extension.sub.on('error', () => console.error('[collab] Redis subscriber unavailable'));
  try {
    await Promise.all([extension.pub.ping(), extension.sub.ping()]);
    return [extension];
  } catch {
    extension.pub.disconnect();
    extension.sub.disconnect();
    throw new Error('Proof shared Redis could not connect');
  }
}
