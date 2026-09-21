import {spawn, type ChildProcess} from 'node:child_process';
import {Deferred, Duration, Effect, Scope} from 'effect';
import {ChildProcessError} from './errors.ts';

export interface ChildSpec {
  readonly label: string;
  readonly command: string;
  readonly args: ReadonlyArray<string>;
  readonly cwd: string;
  readonly env: Readonly<Record<string, string>>;
  readonly gracePeriod?: Duration.Duration;
}

export interface ChildExit {
  readonly code: number | null;
  readonly signal: NodeJS.Signals | null;
}

export interface ChildHandle {
  readonly pid: number;
  readonly exited: Effect.Effect<ChildExit>;
  readonly isRunning: Effect.Effect<boolean>;
}

const DEFAULT_GRACE = Duration.seconds(10);

const awaitExit = (child: ChildProcess): Promise<ChildExit> =>
  new Promise((resolve) => {
    if (child.exitCode !== null || child.signalCode !== null) {
      resolve({code: child.exitCode, signal: child.signalCode});
      return;
    }
    child.once('exit', (code, signal) => resolve({code, signal}));
  });

const terminate = (child: ChildProcess, grace: Duration.Duration): Effect.Effect<ChildExit> =>
  Effect.promise(async () => {
    if (child.exitCode !== null || child.signalCode !== null) return {code: child.exitCode, signal: child.signalCode};
    const exit = awaitExit(child);
    child.kill('SIGTERM');
    const timer = new Promise<'timeout'>((resolve) => setTimeout(() => resolve('timeout'), Duration.toMillis(grace)).unref());
    const first = await Promise.race([exit, timer]);
    if (first !== 'timeout') return first;
    child.kill('SIGKILL');
    return exit;
  });

export const spawnScoped = (spec: ChildSpec): Effect.Effect<ChildHandle, ChildProcessError, Scope.Scope> =>
  Effect.gen(function* () {
    const exited = yield* Deferred.make<ChildExit>();
    const child = yield* Effect.acquireRelease(
      Effect.callback<ChildProcess, ChildProcessError>((resume) => {
        const proc = spawn(spec.command, [...spec.args], {cwd: spec.cwd, env: {...spec.env}, stdio: ['ignore', 'inherit', 'inherit']});
        const onSpawn = () => {
          proc.off('error', onError);
          resume(Effect.succeed(proc));
        };
        const onError = (error: Error) => {
          proc.off('spawn', onSpawn);
          resume(Effect.fail(new ChildProcessError({label: spec.label, message: error.message, cause: error})));
        };
        proc.once('spawn', onSpawn);
        proc.once('error', onError);
      }),
      (proc) => terminate(proc, spec.gracePeriod ?? DEFAULT_GRACE),
    );
    child.on('error', () => {});
    void awaitExit(child).then((exit) => Effect.runFork(Deferred.succeed(exited, exit)));
    return {
      pid: child.pid ?? -1,
      exited: Deferred.await(exited),
      isRunning: Effect.sync(() => child.exitCode === null && child.signalCode === null),
    };
  });

export const processAlive = (pid: number): boolean => {
  try {
    process.kill(pid, 0);
    return true;
  } catch (error) {
    return (error as NodeJS.ErrnoException).code === 'EPERM';
  }
};
