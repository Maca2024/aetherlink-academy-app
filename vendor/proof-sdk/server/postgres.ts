import { AsyncLocalStorage } from 'node:async_hooks';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import pg from 'pg';

type QueryResult<Row> = { rows: Row[]; rowCount: number };
type TransactionScope = { client: any; active: boolean; childActive: boolean };
type DatabaseOptions = {
  connectionString: string;
  schema?: string;
  maxConnections?: number;
  onPoolError?: (error: Error) => void;
};

export function createProofDatabase(options: DatabaseOptions) {
  const schema = options.schema ?? 'proof';
  if (!/^[a-z][a-z0-9_]{0,62}$/.test(schema)) throw new Error('Invalid Proof database schema');
  const connectionUrl = new URL(options.connectionString);
  for (const key of ['sslmode', 'sslcert', 'sslkey', 'sslrootcert']) connectionUrl.searchParams.delete(key);
  const pool = new pg.Pool({
    connectionString: connectionUrl.toString(),
    ssl: { rejectUnauthorized: true },
    max: options.maxConnections ?? 5,
    connectionTimeoutMillis: 10_000,
    idleTimeoutMillis: 30_000,
  });
  pool.on('error', (error: Error) => {
    if (options.onPoolError) options.onPoolError(error);
    else console.error('Proof database idle connection failed');
  });
  const scope = new AsyncLocalStorage<TransactionScope>();
  let savepointSequence = 0;

  async function query<Row = Record<string, unknown>>(sql: string, values: readonly unknown[] = []): Promise<QueryResult<Row>> {
    const current = scope.getStore();
    if (!current) return transaction(() => query<Row>(sql, values));
    if (!current.active || current.childActive) throw new Error('Transaction scope is not available');
    const result = await current.client.query(sql, [...values]);
    const last = Array.isArray(result) ? result.at(-1) : result;
    return { rows: last?.rows ?? [], rowCount: last?.rowCount ?? 0 };
  }

  async function transaction<T>(run: (connection: { query: typeof query }) => Promise<T>): Promise<T> {
    const parent = scope.getStore();
    if (parent && (!parent.active || parent.childActive)) throw new Error('Transaction scope is not available');
    const client = parent?.client ?? await pool.connect();
    const savepoint = `proof_savepoint_${++savepointSequence}`;
    const current = { client, active: true, childActive: false };
    if (parent) parent.childActive = true;
    let begun = false;
    let discard = false;
    try {
      await client.query(parent ? `SAVEPOINT ${savepoint}` : 'BEGIN');
      begun = true;
      if (!parent) {
        await client.query("SELECT set_config('search_path', $1, true), set_config('statement_timeout', '30000', true), set_config('lock_timeout', '10000', true), set_config('idle_in_transaction_session_timeout', '30000', true)", [`${schema},pg_catalog`]);
      }
      const result = await scope.run(current, () => run(database));
      if (current.childActive) throw new Error('Nested transaction must be awaited');
      current.active = false;
      await client.query(parent ? `RELEASE SAVEPOINT ${savepoint}` : 'COMMIT');
      return result;
    } catch (error) {
      current.active = false;
      if (begun) {
        try {
          await client.query(parent ? `ROLLBACK TO SAVEPOINT ${savepoint}` : 'ROLLBACK');
          if (parent) await client.query(`RELEASE SAVEPOINT ${savepoint}`);
        } catch {
          discard = true;
          if (parent) parent.active = false;
        }
      }
      throw error;
    } finally {
      current.active = false;
      if (parent) parent.childActive = false;
      else client.release(discard);
    }
  }

  async function initialize(): Promise<void> {
    const sql = await readFile(new URL('./postgres-schema.sql', import.meta.url), 'utf8');
    await transaction(async () => {
      await query('SELECT pg_advisory_xact_lock(hashtextextended($1, 0))', [`proof-schema:${schema}`]);
      const existing = await query('SELECT 1 FROM pg_catalog.pg_namespace WHERE nspname = $1', [schema]);
      const migration = `1:${createHash('sha256').update(sql).digest('hex')}`;
      if (existing.rowCount) {
        const relations = await query<{ relname: string }>(`
          SELECT c.relname FROM pg_catalog.pg_class c
          JOIN pg_catalog.pg_namespace n ON n.oid=c.relnamespace
          WHERE n.nspname=$1 AND c.relkind IN ('r','p')
        `, [schema]);
        if (relations.rows.some(row => row.relname === 'system_metadata')) {
          const applied = await query<{ value: string }>(
            'SELECT value FROM system_metadata WHERE key=$1', ['proof_schema_migration']);
          if (applied.rows[0]?.value === migration) return;
          if (applied.rowCount) throw new Error('Proof schema migration version or checksum differs; apply an explicit migration before startup');
        }
        if (relations.rowCount) throw new Error('Proof schema is unversioned; an explicit offline migration is required before startup');
      } else {
        await query(`CREATE SCHEMA "${schema}"`);
      }
      await query(sql);
      await query('INSERT INTO system_metadata (key,value,updated_at) VALUES ($1,$2,$3)',
        ['proof_schema_migration', migration, new Date().toISOString()]);
    });
  }

  const database = { query, transaction, initialize, outsideTransaction: <T>(run: () => T): T => scope.exit(run), close: () => pool.end() };
  return database;
}

export type ProofDatabase = ReturnType<typeof createProofDatabase>;
