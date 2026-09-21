import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {Effect, FileSystem, Path} from 'effect';
import {SqlClient} from 'effect/unstable/sql/SqlClient';
import * as Migrator from 'effect/unstable/sql/Migrator';
import {PgMigrator} from '@effect/sql-pg';

export const migrationsDirectory = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '..', 'drizzle');

const FILE_PATTERN = /^(\d+)_(.+)\.sql$/;

/**
 * drizzle-kit's own `.ts`/`migrate()` runner needs a live `pg` driver, which
 * would duplicate the connection this service already manages through
 * `@effect/sql-pg`. This loader instead reads the same `.sql` files it
 * generates and runs them through the ambient `SqlClient`, split on its
 * `--> statement-breakpoint` markers because the extended query protocol
 * `sql.unsafe` uses cannot run more than one statement per call.
 */
export const fromSqlDirectory = (directory: string): Migrator.Loader<FileSystem.FileSystem | Path.Path> =>
  Effect.gen(function* () {
    const fs = yield* FileSystem.FileSystem;
    const pathService = yield* Path.Path;
    const entries = yield* fs.readDirectory(directory).pipe(
      Effect.mapError((cause) => new Migrator.MigrationError({kind: 'BadState', message: `cannot read migrations directory ${directory}`, cause})),
    );
    const files = entries
      .filter((entry) => entry.endsWith('.sql'))
      .map((entry) => {
        const match = FILE_PATTERN.exec(entry);
        if (!match) return null;
        const [, idText, name] = match;
        // drizzle-kit names files from 0000; the shared Migrator engine treats id 0
        // as "no migrations applied yet" and silently skips a migration numbered 0,
        // so file ids are shifted by one to stay in the Migrator's 1-based space.
        return {id: Number(idText) + 1, name, entry};
      })
      .filter((parsed): parsed is {id: number; name: string; entry: string} => parsed !== null)
      .sort((a, b) => a.id - b.id);

    const resolved: Array<readonly [id: number, name: string, load: Effect.Effect<Effect.Effect<void, unknown, SqlClient>>]> = [];
    for (const {id, name, entry} of files) {
      const content = yield* fs.readFileString(pathService.join(directory, entry)).pipe(
        Effect.mapError((cause) => new Migrator.MigrationError({kind: 'BadState', message: `cannot read migration ${entry}`, cause})),
      );
      const statements = content
        .split('--> statement-breakpoint')
        .map((statement) => statement.trim())
        .filter((statement) => statement.length > 0);
      // The Loader contract expects `load`, once run, to produce the real
      // migration effect (mirroring `Migrator.fromRecord`) rather than to run
      // it directly, so file content is read here and the statements below
      // only need `SqlClient`.
      const apply = Effect.gen(function* () {
        const sql = yield* SqlClient;
        for (const statement of statements) {
          yield* sql.unsafe(statement);
        }
      });
      resolved.push([id, name, Effect.succeed(apply)]);
    }
    return resolved;
  });

export const run = PgMigrator.run({loader: fromSqlDirectory(migrationsDirectory), table: 'academy_curriculum_migrations'});
