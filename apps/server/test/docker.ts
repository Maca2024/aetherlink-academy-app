import {execFileSync} from 'node:child_process';
import {mkdirSync} from 'node:fs';
import {tmpdir} from 'node:os';
import path from 'node:path';

export const POSTGRES_CONTAINER = 'academy-wave-foundation-postgres';
export const REDIS_CONTAINER = 'academy-wave-foundation-redis';
export const POSTGRES_PORT = 55438;
export const REDIS_PORT = 56388;
export const DATABASE_URL = `postgresql://academy:academy-test@127.0.0.1:${POSTGRES_PORT}/academy?sslmode=disable`;
export const REDIS_URL = `redis://127.0.0.1:${REDIS_PORT}`;

export const docker = (...args: string[]): string =>
  execFileSync('docker', args, {encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe']}).trim();

const tryDocker = (...args: string[]): string | null => {
  try {
    return docker(...args);
  } catch {
    return null;
  }
};

export const dockerAvailable = (): boolean => tryDocker('version', '--format', '{{.Server.Version}}') !== null;

export const containerState = (name: string): string | null => tryDocker('inspect', '--format', '{{.State.Status}}', name);

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const waitUntil = async (label: string, check: () => Promise<boolean> | boolean, timeoutMs: number, intervalMs = 500): Promise<void> => {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    if (await check()) return;
    await sleep(intervalMs);
  }
  throw new Error(`timed out after ${timeoutMs}ms waiting for ${label}`);
};

const OWNER_LABEL = 'academy.wave-foundation.owner';
const owner = `services-test-${process.pid}`;

const removeOwned = (name: string): void => {
  const label = tryDocker('inspect', '--format', `{{index .Config.Labels "${OWNER_LABEL}"}}`, name);
  if (label === null) return;
  if (!label.startsWith('services-test-')) throw new Error(`container ${name} exists but is not owned by the services test (owner label: ${label || 'none'})`);
  tryDocker('rm', '--force', name);
};

export const TLS_DIR = path.join(tmpdir(), 'academy-wave-foundation-tls');
export const CA_CERT = path.join(TLS_DIR, 'server.crt');

const prepareTls = (): void => {
  mkdirSync(TLS_DIR, {recursive: true, mode: 0o755});
  docker(
    'run', '--rm', '--volume', `${TLS_DIR}:/tls`, '--entrypoint', 'openssl', 'postgres:16',
    'req', '-x509', '-newkey', 'rsa:2048', '-sha256', '-nodes', '-days', '2',
    '-subj', '/CN=localhost', '-addext', 'subjectAltName=DNS:localhost,IP:127.0.0.1',
    '-keyout', '/tls/server.key', '-out', '/tls/server.crt',
  );
  docker('run', '--rm', '--volume', `${TLS_DIR}:/tls`, '--entrypoint', '/bin/sh', 'postgres:16', '-c',
    'chown 999:999 /tls/server.key /tls/server.crt && chmod 600 /tls/server.key && chmod 644 /tls/server.crt');
};

export const startServices = async (): Promise<void> => {
  removeOwned(POSTGRES_CONTAINER);
  removeOwned(REDIS_CONTAINER);
  prepareTls();
  docker(
    'run', '--detach', '--name', POSTGRES_CONTAINER, '--label', `${OWNER_LABEL}=${owner}`,
    '--publish', `127.0.0.1:${POSTGRES_PORT}:5432`,
    '--env', 'POSTGRES_USER=academy', '--env', 'POSTGRES_PASSWORD=academy-test', '--env', 'POSTGRES_DB=academy',
    '--volume', `${TLS_DIR}:/tls:ro`,
    'postgres:16', 'postgres', '-c', 'ssl=on', '-c', 'ssl_cert_file=/tls/server.crt', '-c', 'ssl_key_file=/tls/server.key',
  );
  docker(
    'run', '--detach', '--name', REDIS_CONTAINER, '--label', `${OWNER_LABEL}=${owner}`,
    '--publish', `127.0.0.1:${REDIS_PORT}:6379`,
    'redis:7-alpine', 'redis-server', '--save', '', '--appendonly', 'no',
  );
  await waitUntil('postgres ready', () => tryDocker('exec', POSTGRES_CONTAINER, 'pg_isready', '-U', 'academy', '-d', 'academy') !== null, 60_000);
  await waitUntil('redis ready', () => tryDocker('exec', REDIS_CONTAINER, 'redis-cli', 'ping') === 'PONG', 30_000);
};

export const stopServices = (): void => {
  removeOwned(POSTGRES_CONTAINER);
  removeOwned(REDIS_CONTAINER);
};

export const pause = (name: string): void => {
  docker('stop', '--time', '5', name);
};

export const resume = async (name: string): Promise<void> => {
  docker('start', name);
  if (name === POSTGRES_CONTAINER) {
    await waitUntil('postgres ready again', () => tryDocker('exec', POSTGRES_CONTAINER, 'pg_isready', '-U', 'academy', '-d', 'academy') !== null, 60_000);
  } else {
    await waitUntil('redis ready again', () => tryDocker('exec', REDIS_CONTAINER, 'redis-cli', 'ping') === 'PONG', 30_000);
  }
};
