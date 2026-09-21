import {existsSync} from 'node:fs';
import {mkdtemp, rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {Effect, Exit, Scope} from 'effect';
import {describe, expect, test} from 'vitest';
import {processAlive, spawnScoped} from '../src/layers/child-process.ts';
import {ChildProcessError} from '../src/layers/errors.ts';

const waitFor = async (predicate: () => boolean, timeoutMs = 5000): Promise<boolean> => {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    if (predicate()) return true;
    await new Promise((resolve) => setTimeout(resolve, 25));
  }
  return predicate();
};

const idleChild = (label: string) =>
  spawnScoped({
    label,
    command: process.execPath,
    args: ['-e', 'setInterval(() => {}, 1000)'],
    cwd: process.cwd(),
    env: {PATH: process.env.PATH ?? ''},
  });

describe('scoped child process supervision', () => {
  test('the child lives while the scope is open and is gone after the scope closes', async () => {
    const scope = await Effect.runPromise(Scope.make());
    const handle = await Effect.runPromise(idleChild('idle').pipe(Scope.provide(scope)));
    expect(handle.pid).toBeGreaterThan(0);
    expect(processAlive(handle.pid)).toBe(true);
    expect(await Effect.runPromise(handle.isRunning)).toBe(true);

    await Effect.runPromise(Scope.close(scope, Exit.void));

    expect(await waitFor(() => !processAlive(handle.pid))).toBe(true);
    const exit = await Effect.runPromise(handle.exited);
    expect(exit.signal === 'SIGTERM' || exit.code !== null).toBe(true);
    expect(await Effect.runPromise(handle.isRunning)).toBe(false);
  });

  test('a child that ignores SIGTERM is killed after the grace period', async () => {
    const tempDir = await mkdtemp(join(tmpdir(), 'academy-child-process-'));
    const marker = join(tempDir, 'ready');
    const scope = await Effect.runPromise(Scope.make());
    let scopeClosed = false;

    try {
      const handle = await Effect.runPromise(
        spawnScoped({
          label: 'stubborn',
          command: process.execPath,
          args: [
            '-e',
            'process.on("SIGTERM", () => {}); require("node:fs").writeFileSync(process.argv[1], "ready"); setInterval(() => {}, 1000)',
            marker,
          ],
          cwd: process.cwd(),
          env: {PATH: process.env.PATH ?? ''},
          gracePeriod: '300 millis' as never,
        }).pipe(Scope.provide(scope)),
      );
      expect(processAlive(handle.pid)).toBe(true);
      expect(await waitFor(() => existsSync(marker))).toBe(true);
      await Effect.runPromise(Scope.close(scope, Exit.void));
      scopeClosed = true;
      expect(await waitFor(() => !processAlive(handle.pid))).toBe(true);
      const exit = await Effect.runPromise(handle.exited);
      expect(exit.signal).toBe('SIGKILL');
    } finally {
      try {
        if (!scopeClosed) await Effect.runPromise(Scope.close(scope, Exit.void));
      } finally {
        await rm(tempDir, {recursive: true, force: true});
      }
    }
  });

  test('a command that cannot be spawned fails with a tagged error and leaves nothing behind', async () => {
    const result = await Effect.runPromise(
      spawnScoped({
        label: 'missing',
        command: '/nonexistent/academy-fixture-binary',
        args: [],
        cwd: process.cwd(),
        env: {},
      }).pipe(Effect.scoped, Effect.result),
    );
    expect(result._tag).toBe('Failure');
    if (result._tag === 'Failure') {
      expect(result.failure).toBeInstanceOf(ChildProcessError);
      expect(result.failure.label).toBe('missing');
    }
  });
});
