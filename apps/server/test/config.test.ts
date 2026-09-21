import {Effect} from 'effect';
import {describe, expect, test} from 'vitest';
import {DEFAULT_PORT, DEFAULT_PROOF_PORT, readConfig} from '../src/layers/config.ts';

const base = {DATABASE_URL: 'postgresql://fixture.invalid/academy', REDIS_URL: 'redis://fixture.invalid:6379'};

describe('server configuration', () => {
  test('defaults to app port 4318 and Proof child on 4418', async () => {
    const config = await Effect.runPromise(readConfig(base));
    expect(config.port).toBe(DEFAULT_PORT);
    expect(config.port).toBe(4318);
    expect(config.proof.port).toBe(DEFAULT_PROOF_PORT);
    expect(config.proof.port).toBe(4418);
    expect(config.proof.mode).toBe('child');
    expect(config.proof.baseUrl).toBe('http://127.0.0.1:4418');
    expect(config.revision).toBeNull();
    expect(config.host).toBe('127.0.0.1');
  });

  test('PROOF_URL switches the bridge to remote mode', async () => {
    const config = await Effect.runPromise(readConfig({...base, PROOF_URL: 'http://proof:4418/'}));
    expect(config.proof.mode).toBe('remote');
    expect(config.proof.baseUrl).toBe('http://proof:4418');
  });

  test('missing DATABASE_URL or Redis URL fails with a tagged ConfigError', async () => {
    for (const env of [{REDIS_URL: base.REDIS_URL}, {DATABASE_URL: base.DATABASE_URL}]) {
      const result = await Effect.runPromise(readConfig(env).pipe(Effect.result));
      expect(result._tag).toBe('Failure');
      if (result._tag === 'Failure') expect(result.failure._tag).toBe('ConfigError');
    }
    const kv = await Effect.runPromise(readConfig({DATABASE_URL: base.DATABASE_URL, KV_URL: 'rediss://kv.invalid:6380'}));
    expect(kv.redisUrl).toBe('rediss://kv.invalid:6380');
  });

  test('rejects a non-numeric PORT', async () => {
    const result = await Effect.runPromise(readConfig({...base, PORT: 'eighty'}).pipe(Effect.result));
    expect(result._tag).toBe('Failure');
  });
});
