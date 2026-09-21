import {describe, expect, test, vi} from 'vitest';
import {closeRedisClient} from '../src/layers/redis.ts';

describe('Redis client finalization', () => {
  test('disconnects when quit never resolves', async () => {
    const disconnect = vi.fn();
    const client = {
      quit: vi.fn(() => new Promise<never>(() => {})),
      disconnect,
    };

    await expect(closeRedisClient(client, 10)).resolves.toBeUndefined();
    expect(disconnect).toHaveBeenCalledOnce();
    expect(client.quit).toHaveBeenCalledOnce();
  });
});
