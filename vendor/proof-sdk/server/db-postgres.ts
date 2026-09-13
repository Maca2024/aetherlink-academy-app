import { AsyncLocalStorage } from 'node:async_hooks';
import { createProofDatabase, type ProofDatabase } from './postgres.js';

const domainScope = new AsyncLocalStorage<boolean>();
const numericColumns = new Set(['id', 'seq', 'version', 'rowid', 'event_id', 'y_state_version', 'projection_y_state_version', 'latest_y_state_version', 'max_update_seq', 'max_snapshot_version', 'count', 'total_bytes']);
function normalizeRow(row: Record<string, unknown>): Record<string, unknown> {
  for (const key of numericColumns) {
    if (typeof row[key] !== 'string') continue;
    const value = Number(row[key]);
    if (!Number.isSafeInteger(value)) throw new Error(`Unsafe integer in Proof column ${key}`);
    row[key] = value;
  }
  return row;
}
function domainDatabase(native: ProofDatabase) {
  async function query(sql: string, values: readonly unknown[] = []) {
    const result = await native.query(sql, values);
    return { rows: result.rows.map(normalizeRow), rowCount: result.rowCount };
  }
  function transaction<T>(run: () => Promise<T>): Promise<T> {
    return native.transaction(() => domainScope.run(true, run));
  }
  function prepare(sql: string) {
    return {
      async get(...values: unknown[]): Promise<unknown> { return (await query(sql, values)).rows[0]; },
      async all(...values: unknown[]): Promise<unknown[]> { return (await query(sql, values)).rows; },
      async run(...values: unknown[]) {
        const result = await query(sql, values);
        return { changes: result.rowCount, insertedId: result.rows[0]?.id ?? result.rows[0]?.seq ?? 0 };
      },
    };
  }
  return { query, transaction, prepare, outsideTransaction: native.outsideTransaction, close: native.close };
}
type DomainDatabase = ReturnType<typeof domainDatabase>;
let database: DomainDatabase | undefined;
let databaseClosing: Promise<void> | undefined;
export function runOutsideDatabaseTransaction<T>(run: () => T): T {
  return domainScope.exit(() => database ? database.outsideTransaction(run) : run());
}
export function getDb(): DomainDatabase {
  if (!database) throw new Error('Await initializeDatabase before using Proof persistence');
  return database;
}
async function withinDomain<T>(run: () => Promise<T>): Promise<T> {
  return domainScope.getStore() ? run() : getDb().transaction(run);
}
export async function initializeDatabase(): Promise<void> {
  if (databaseClosing) await databaseClosing;
  if (database) return;
  const native = createProofDatabase({ connectionString: process.env.DATABASE_URL ?? '', schema: process.env.PROOF_DATABASE_SCHEMA ?? 'proof' });
  try {
    await native.initialize();
    database = domainDatabase(native);
    await database.transaction(async () => {
      await database!.query('SELECT pg_advisory_xact_lock(hashtextextended($1, 0))', ['proof-environment']);
      await assertDatabaseEnvironmentSafeForRuntime();
    });
  } catch (error) {
    database = undefined;
    await native.close();
    throw error;
  }
}
export async function closeDatabase(): Promise<void> {
  if (databaseClosing) return databaseClosing;
  const previous = database;
  if (!previous) return;
  databaseClosing = previous.close().finally(() => {
    if (database === previous) database = undefined;
    databaseClosing = undefined;
  });
  return databaseClosing;
}

import { createHash, randomUUID, timingSafeEqual } from 'crypto';
import type { ShareRole, ShareState } from './share-types.js';
import { getHeadlessMilkdownParser, parseMarkdownWithHtmlFallback, serializeSingleNode, summarizeParseError, } from './milkdown-headless.js';
import { recordMutationBackfill, recordMutationIdempotencyDualRead } from './metrics.js';
const DEFAULT_EVENT_PAGE_SIZE = 100;
const DB_METADATA_TABLE = 'system_metadata';
const DB_ENV_METADATA_KEY = 'db_environment';
const GLOBAL_COLLAB_ADMISSION_GUARD_METADATA_KEY = 'collab.global_admission_guard';
const GLOBAL_COLLAB_ADMISSION_EPOCH_METADATA_KEY = 'collab.global_admission_epoch';
const MUTATION_IDEMPOTENCY_TABLE = 'mutation_idempotency';
const MUTATION_OUTBOX_TABLE = 'mutation_outbox';
const MARK_TOMBSTONES_TABLE = 'mark_tombstones';
const ACTIVE_COLLAB_CONNECTIONS_TABLE = 'active_collab_connections';
const MARK_TOMBSTONE_RETENTION_DAYS = 35;
const MUTATION_IDEMPOTENCY_BACKFILL_CURSOR_KEY = 'backfill.mutation_idempotency.last_rowid';
const MUTATION_OUTBOX_BACKFILL_CURSOR_KEY = 'backfill.mutation_outbox.last_event_id';
let warnedCrossEnvironmentOverride = false;
let lastActiveCollabConnectionPruneAt = 0;
const DEFAULT_ACTIVE_COLLAB_CONNECTION_TTL_MS = 45000;
const DEFAULT_ACTIVE_COLLAB_CONNECTION_PRUNE_INTERVAL_MS = 10000;
const DEFAULT_DOCUMENT_LIVE_COLLAB_LEASE_TTL_MS = 45000;
const DEFAULT_MAX_YJS_UPDATE_BLOB_BYTES = 8 * 1024 * 1024;
export class OversizedYjsUpdateError extends Error {
    readonly slug: string;
    readonly bytes: number;
    readonly limitBytes: number;
    readonly sourceActor: string | null;
    constructor(slug: string, bytes: number, limitBytes: number, sourceActor: string | null) {
        super(`Oversized Yjs update blocked for ${slug}: ${bytes} bytes exceeds ${limitBytes} byte limit`);
        this.name = 'OversizedYjsUpdateError';
        this.slug = slug;
        this.bytes = bytes;
        this.limitBytes = limitBytes;
        this.sourceActor = sourceActor;
    }
}
function getMaxYjsUpdateBlobBytes(): number {
    return parsePositiveInt(process.env.COLLAB_MAX_UPDATE_BLOB_BYTES, DEFAULT_MAX_YJS_UPDATE_BLOB_BYTES);
}
function assertYjsUpdateWithinLimit(documentSlug: string, update: Uint8Array, sourceActor: string | null | undefined): void {
    const bytes = update.byteLength;
    const limitBytes = getMaxYjsUpdateBlobBytes();
    if (bytes <= limitBytes)
        return;
    throw new OversizedYjsUpdateError(documentSlug, bytes, limitBytes, sourceActor ?? null);
}
function normalizeEnvironment(value: string | null | undefined): string {
    const normalized = (value ?? '').trim().toLowerCase();
    if (!normalized)
        return 'development';
    if (normalized === 'prod' || normalized === 'production')
        return 'production';
    if (normalized === 'dev' || normalized === 'development' || normalized === 'local')
        return 'development';
    if (normalized === 'stage' || normalized === 'staging')
        return 'staging';
    if (normalized === 'test' || normalized === 'testing')
        return 'test';
    return normalized;
}
function getRuntimeEnvironment(): string {
    return normalizeEnvironment(process.env.PROOF_ENV || process.env.NODE_ENV || 'development');
}
function isTruthyFlag(value: string | undefined): boolean {
    const normalized = (value || '').trim().toLowerCase();
    return normalized === '1' || normalized === 'true' || normalized === 'yes' || normalized === 'on';
}
function isCrossEnvironmentWriteOverrideEnabled(): boolean {
    return isTruthyFlag(process.env.ALLOW_CROSS_ENV_WRITES);
}
async function readMetadataValue(d: DomainDatabase, key: string): Promise<string | null> {
    const row = (await d.prepare(`
    SELECT value
    FROM ${DB_METADATA_TABLE}
    WHERE key = $1
    LIMIT 1
  `).get(key)) as {
        value?: string;
    } | undefined;
    return typeof row?.value === 'string' && row.value.trim().length > 0
        ? row.value.trim()
        : null;
}
async function writeMetadataValue(d: DomainDatabase, key: string, value: string): Promise<void> {
    const now = new Date().toISOString();
    (await d.prepare(`
    INSERT INTO ${DB_METADATA_TABLE} (key, value, updated_at)
    VALUES ($1, $2, $3)
   ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = EXCLUDED.updated_at`).run(key, value, now));
}
async function readMetadataNumber(d: DomainDatabase, key: string, fallback: number = 0): Promise<number> {
    const raw = (await readMetadataValue(d, key));
    if (!raw)
        return fallback;
    const parsed = Number.parseInt(raw, 10);
    return Number.isFinite(parsed) && parsed >= 0 ? parsed : fallback;
}
async function writeMetadataNumber(d: DomainDatabase, key: string, value: number): Promise<void> {
    const normalized = Number.isFinite(value) && value >= 0 ? Math.trunc(value) : 0;
    (await writeMetadataValue(d, key, String(normalized)));
}
async function hasAnyDocuments(d: DomainDatabase): Promise<boolean> {
    const row = (await d.prepare(`
    SELECT 1 AS present
    FROM documents
    LIMIT 1
  `).get()) as {
        present?: number;
    } | undefined;
    return row?.present === 1;
}
async function readOrInitializeDatabaseEnvironment(d: DomainDatabase): Promise<string> {
    const existing = (await readMetadataValue(d, DB_ENV_METADATA_KEY));
    if (existing)
        return normalizeEnvironment(existing);
    const runtimeEnv = getRuntimeEnvironment();
    const explicitInitEnvRaw = (process.env.PROOF_DB_ENV_INIT || '').trim();
    const explicitInitEnv = explicitInitEnvRaw ? normalizeEnvironment(explicitInitEnvRaw) : '';
    if (explicitInitEnv) {
        (await writeMetadataValue(d, DB_ENV_METADATA_KEY, explicitInitEnv));
        return explicitInitEnv;
    }
    if (runtimeEnv === 'production') {
        (await writeMetadataValue(d, DB_ENV_METADATA_KEY, runtimeEnv));
        return runtimeEnv;
    }
    if (!(await hasAnyDocuments(d))) {
        (await writeMetadataValue(d, DB_ENV_METADATA_KEY, runtimeEnv));
        return runtimeEnv;
    }
    if (isCrossEnvironmentWriteOverrideEnabled()) {
        console.warn('[db] Existing DB missing environment label; inferring from runtime due to ALLOW_CROSS_ENV_WRITES override', {
            runtimeEnv,
        });
        (await writeMetadataValue(d, DB_ENV_METADATA_KEY, runtimeEnv));
        return runtimeEnv;
    }
    throw new Error(`[db] Existing database is missing ${DB_ENV_METADATA_KEY} metadata. `
        + `Refusing to infer label for runtime "${runtimeEnv}". `
        + `Set PROOF_DB_ENV_INIT once (for example: development).`);
}
async function assertDatabaseEnvironmentCompatibility(context: 'startup' | 'write', operation?: string): Promise<void> {
    const d = getDb();
    const runtimeEnv = getRuntimeEnvironment();
    const dbEnv = (await readOrInitializeDatabaseEnvironment(d));
    if (runtimeEnv === dbEnv)
        return;
    if (isCrossEnvironmentWriteOverrideEnabled()) {
        if (!warnedCrossEnvironmentOverride) {
            warnedCrossEnvironmentOverride = true;
            console.warn('[db] Cross-environment write override enabled; proceeding unsafely', {
                context,
                operation: operation ?? null,
                runtimeEnv,
                dbEnv,
            });
        }
        return;
    }
    const operationPart = operation ? ` operation="${operation}"` : '';
    throw new Error(`[db] ${context} blocked due to environment mismatch:${operationPart} `
        + `runtime="${runtimeEnv}" database="${dbEnv}". `
        + 'Set ALLOW_CROSS_ENV_WRITES=1 to override (unsafe).');
}
async function assertWritesAllowed(operation: string): Promise<void> {
    (await assertDatabaseEnvironmentCompatibility('write', operation));
}
export interface DocumentRow {
    slug: string;
    doc_id: string | null;
    title: string | null;
    markdown: string;
    marks: string;
    revision: number;
    y_state_version: number;
    share_state: ShareState;
    access_epoch: number;
    collab_bootstrap_epoch: number;
    live_collab_seen_at: string | null;
    live_collab_access_epoch: number | null;
    active: number;
    owner_id: string | null;
    owner_secret: string | null;
    owner_secret_hash: string | null;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
}
export interface DocumentProjectionRow {
    document_slug: string;
    revision: number;
    y_state_version: number;
    markdown: string;
    marks_json: string;
    plain_text: string;
    updated_at: string;
    health: 'healthy' | 'projection_stale' | 'quarantined';
    health_reason: string | null;
}
export interface ProjectedDocumentRow extends DocumentRow {
    plain_text: string;
    projection_health: 'healthy' | 'projection_stale' | 'quarantined';
    projection_health_reason: string | null;
    projection_revision: number | null;
    projection_y_state_version: number | null;
    projection_updated_at: string | null;
    canonical_markdown: string;
    canonical_marks: string;
}
export interface DocumentAuthStateRow {
    slug: string;
    doc_id: string | null;
    share_state: ShareState;
    access_epoch: number;
    owner_id: string | null;
    owner_secret: string | null;
    owner_secret_hash: string | null;
}
export interface DocumentBlockRow {
    document_id: string;
    block_id: string;
    ordinal: number;
    node_type: string;
    attrs_json: string;
    markdown_hash: string;
    text_preview: string;
    created_revision: number;
    last_seen_revision: number;
    retired_revision: number | null;
}
export interface DocumentAccessRow {
    token_id: string;
    document_slug: string;
    role: ShareRole;
    secret_hash: string;
    created_at: string;
    revoked_at: string | null;
}
export interface PersistedGlobalCollabAdmissionGuardEntry {
    reason: string;
    untilMs: number;
    triggeredAt: number;
    lastTriggeredAt: number;
    count: number;
    details?: Record<string, unknown>;
}
export async function getGlobalCollabAdmissionEpoch(): Promise<number> { return withinDomain(async () => {

    const d = getDb();
    return (await readMetadataNumber(d, GLOBAL_COLLAB_ADMISSION_EPOCH_METADATA_KEY, 0));

}); }
export async function bumpGlobalCollabAdmissionEpoch(): Promise<number> { return withinDomain(async () => {

    (await assertWritesAllowed('bumpGlobalCollabAdmissionEpoch'));
    const d = getDb();
    const result = await d.query(`
      INSERT INTO system_metadata (key, value, updated_at) VALUES ($1, '1', $2)
      ON CONFLICT (key) DO UPDATE SET value = (system_metadata.value::bigint + 1)::text,
        updated_at = EXCLUDED.updated_at
      RETURNING value
    `, [GLOBAL_COLLAB_ADMISSION_EPOCH_METADATA_KEY, new Date().toISOString()]);
    const nextEpoch = Number(result.rows[0].value);
    if (!Number.isSafeInteger(nextEpoch)) throw new Error('Unsafe Proof admission epoch');
    return nextEpoch;

}); }
function parsePersistedGlobalCollabAdmissionGuard(raw: string | null): PersistedGlobalCollabAdmissionGuardEntry | null {
    if (!raw)
        return null;
    try {
        const parsed = JSON.parse(raw) as Record<string, unknown>;
        if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed))
            return null;
        if (typeof parsed.reason !== 'string' || parsed.reason.trim().length === 0)
            return null;
        const untilMs = Number(parsed.untilMs);
        const triggeredAt = Number(parsed.triggeredAt);
        const lastTriggeredAt = Number(parsed.lastTriggeredAt);
        const count = Number(parsed.count);
        if (!Number.isFinite(untilMs) || untilMs <= 0)
            return null;
        if (!Number.isFinite(triggeredAt) || triggeredAt <= 0)
            return null;
        if (!Number.isFinite(lastTriggeredAt) || lastTriggeredAt <= 0)
            return null;
        if (!Number.isFinite(count) || count <= 0)
            return null;
        const details = parsed.details && typeof parsed.details === 'object' && !Array.isArray(parsed.details)
            ? parsed.details as Record<string, unknown>
            : undefined;
        return {
            reason: parsed.reason.trim(),
            untilMs: Math.trunc(untilMs),
            triggeredAt: Math.trunc(triggeredAt),
            lastTriggeredAt: Math.trunc(lastTriggeredAt),
            count: Math.trunc(count),
            ...(details ? { details } : {}),
        };
    }
    catch {
        return null;
    }
}
export interface DocumentEventRow {
    id: number;
    document_slug: string;
    document_revision: number | null;
    event_type: string;
    event_data: string;
    actor: string;
    idempotency_key: string | null;
    mutation_route: string | null;
    tombstone_revision: number | null;
    created_at: string;
    acked_by: string | null;
    acked_at: string | null;
}
export interface ServerIncidentEventRow {
    id: number;
    request_id: string | null;
    slug: string | null;
    subsystem: string;
    level: 'info' | 'warn' | 'error';
    event_type: string;
    message: string;
    data_json: string;
    created_at: string;
}
export type MutationIdempotencyState = 'pending' | 'completed';
export type MutationIdempotencyRecord = {
    state: MutationIdempotencyState;
    response: Record<string, unknown> | null;
    requestHash: string | null;
    statusCode: number | null;
    tombstoneRevision: number | null;
    createdAt: string;
    completedAt: string | null;
    leaseExpiresAt: string | null;
    lastSeenAt: string | null;
};
export interface ServerIncidentEventInput {
    timestamp?: string;
    requestId?: string | null;
    slug?: string | null;
    subsystem: string;
    level: 'info' | 'warn' | 'error';
    eventType: string;
    message: string;
    data?: Record<string, unknown> | null;
}
export interface MutationOutboxRow {
    id: number;
    document_slug: string;
    document_revision: number | null;
    event_id: number | null;
    event_type: string;
    event_data: string;
    actor: string;
    idempotency_key: string | null;
    mutation_route: string | null;
    tombstone_revision: number | null;
    created_at: string;
    delivered_at: string | null;
}
export interface MarkTombstoneRow {
    document_slug: string;
    mark_id: string;
    status: 'accepted' | 'rejected' | 'resolved';
    resolved_revision: number;
    created_at: string;
    expires_at: string;
}
export interface DocumentYUpdateMetaRow {
    seq: number;
    source_actor: string | null;
    created_at: string;
}
export interface DocumentYUpdateRow extends DocumentYUpdateMetaRow {
    update: Uint8Array;
}
export interface DocumentYSnapshotRow {
    version: number;
    snapshot: Uint8Array;
    created_at: string;
}
export interface ShareAuthSessionRow {
    session_token_hash: string;
    provider: string;
    every_user_id: number;
    email: string;
    name: string | null;
    subscriber: number;
    access_token: string;
    refresh_token: string | null;
    access_expires_at: string;
    session_expires_at: string;
    last_verified_at: string;
    revoked_at: string | null;
    created_at: string;
    updated_at: string;
}
export interface ActiveCollabConnectionRow {
    connection_id: string;
    document_slug: string;
    role: ShareRole;
    access_epoch: number;
    instance_id: string;
    connected_at: string;
    last_seen_at: string;
}
export interface ActiveCollabConnectionInput {
    connectionId: string;
    slug: string;
    role: ShareRole;
    accessEpoch: number;
    instanceId: string;
    observedAt?: string;
}
export async function getDatabaseEnvironment(): Promise<string> { return withinDomain(async () => {

    return (await readOrInitializeDatabaseEnvironment(getDb()));

}); }
export async function assertDatabaseEnvironmentSafeForRuntime(): Promise<void> { return withinDomain(async () => {

    (await assertDatabaseEnvironmentCompatibility('startup'));

}); }
export async function getPersistedGlobalCollabAdmissionGuard(): Promise<PersistedGlobalCollabAdmissionGuardEntry | null> { return withinDomain(async () => {

    const d = getDb();
    return parsePersistedGlobalCollabAdmissionGuard((await readMetadataValue(d, GLOBAL_COLLAB_ADMISSION_GUARD_METADATA_KEY)));

}); }
export async function upsertPersistedGlobalCollabAdmissionGuard(entry: PersistedGlobalCollabAdmissionGuardEntry): Promise<PersistedGlobalCollabAdmissionGuardEntry> { return withinDomain(async () => {

    (await assertWritesAllowed('upsertPersistedGlobalCollabAdmissionGuard'));
    const d = getDb();
    (await writeMetadataValue(d, GLOBAL_COLLAB_ADMISSION_GUARD_METADATA_KEY, JSON.stringify({
        reason: entry.reason,
        untilMs: Math.trunc(entry.untilMs),
        triggeredAt: Math.trunc(entry.triggeredAt),
        lastTriggeredAt: Math.trunc(entry.lastTriggeredAt),
        count: Math.trunc(entry.count),
        details: entry.details ?? {},
    })));
    return (await getPersistedGlobalCollabAdmissionGuard()) as PersistedGlobalCollabAdmissionGuardEntry;

}); }
export async function clearPersistedGlobalCollabAdmissionGuard(): Promise<void> { return withinDomain(async () => {

    (await assertWritesAllowed('clearPersistedGlobalCollabAdmissionGuard'));
    const d = getDb();
    (await d.prepare(`
    DELETE FROM ${DB_METADATA_TABLE}
    WHERE key = $1
  `).run(GLOBAL_COLLAB_ADMISSION_GUARD_METADATA_KEY));

}); }
function hashSecret(value: string): string {
    return createHash('sha256').update(value).digest('hex');
}
export function hashOpaqueToken(value: string): string {
    return hashSecret(value);
}
function timingSafeEqualString(a: string, b: string): boolean {
    const aBuf = Buffer.from(a, 'utf8');
    const bBuf = Buffer.from(b, 'utf8');
    if (aBuf.length !== bBuf.length)
        return false;
    return timingSafeEqual(aBuf, bBuf);
}
function parsePositiveInt(value: string | undefined, fallback: number): number {
    const parsed = value ? Number.parseInt(value, 10) : Number.NaN;
    return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}
function normalizeProjectionPlainText(markdown: string): string {
    return (markdown ?? '')
        .replace(/<\/?(?:p|br|div|li|ul|ol|blockquote|h[1-6])\b[^>]*>/gi, ' ')
        .replace(/<[^>]+>/g, ' ')
        .replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1')
        .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
        .replace(/[`*_~>#-]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}
async function upsertDocumentProjectionRow(slug: string, markdown: string, marks: string, revision: number, yStateVersion: number, updatedAt: string, health: DocumentProjectionRow['health'] = 'healthy', healthReason: string | null = null): Promise<void> {
    (await getDb().prepare(`
    INSERT INTO document_projections (
      document_slug,
      revision,
      y_state_version,
      markdown,
      marks_json,
      plain_text,
      updated_at,
      health,
      health_reason
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    ON CONFLICT(document_slug) DO UPDATE SET
      revision = excluded.revision,
      y_state_version = excluded.y_state_version,
      markdown = excluded.markdown,
      marks_json = excluded.marks_json,
      plain_text = excluded.plain_text,
      updated_at = excluded.updated_at,
      health = excluded.health,
      health_reason = excluded.health_reason
  `).run(slug, revision, yStateVersion, markdown, marks, normalizeProjectionPlainText(markdown), updatedAt, health, health === 'quarantined' ? healthReason : null));
}
async function getDocumentRevisionForSlug(d: DomainDatabase, slug: string): Promise<number | null> {
    const row = (await d.prepare(`
    SELECT revision
    FROM documents
    WHERE slug = $1
    LIMIT 1
  `).get(slug)) as {
        revision?: number;
    } | undefined;
    return typeof row?.revision === 'number' ? row.revision : null;
}
async function backfillLegacyMutationRouteMetadata(filters?: {
    documentSlug?: string;
    idempotencyKey?: string;
}): Promise<void> {
    const d = getDb();
    const clauses = ['mutation_route IS NULL', 'idempotency_key IS NOT NULL'];
    const params: Array<string> = [];
    if (typeof filters?.documentSlug === 'string' && filters.documentSlug.trim()) {
        clauses.push('document_slug = $' + (params.length + 1));
        params.push(filters.documentSlug);
    }
    if (typeof filters?.idempotencyKey === 'string' && filters.idempotencyKey.trim()) {
        clauses.push('idempotency_key = $' + (params.length + 1));
        params.push(filters.idempotencyKey);
    }
    const whereClause = clauses.join(' AND ');
    (await d.prepare(`
    UPDATE document_events
    SET mutation_route = (
      SELECT CASE WHEN COUNT(DISTINCT route) = 1 THEN MIN(route) ELSE NULL END
      FROM (
        SELECT route
        FROM ${MUTATION_IDEMPOTENCY_TABLE}
        WHERE document_slug = document_events.document_slug
          AND idempotency_key = document_events.idempotency_key
          AND route IS NOT NULL
        UNION ALL
        SELECT route
        FROM idempotency_keys
        WHERE document_slug = document_events.document_slug
          AND idempotency_key = document_events.idempotency_key
          AND route IS NOT NULL
      ) inferred_routes
    )
    WHERE ${whereClause}
      AND (
        SELECT COUNT(DISTINCT route)
        FROM (
          SELECT route
          FROM ${MUTATION_IDEMPOTENCY_TABLE}
          WHERE document_slug = document_events.document_slug
            AND idempotency_key = document_events.idempotency_key
            AND route IS NOT NULL
          UNION ALL
          SELECT route
          FROM idempotency_keys
          WHERE document_slug = document_events.document_slug
            AND idempotency_key = document_events.idempotency_key
            AND route IS NOT NULL
        ) inferred_routes
      ) = 1
  `).run(...params));
    (await d.prepare(`
    UPDATE ${MUTATION_OUTBOX_TABLE}
    SET mutation_route = COALESCE(
      (
        SELECT document_events.mutation_route
        FROM document_events
        WHERE document_events.id = ${MUTATION_OUTBOX_TABLE}.event_id
          AND document_events.mutation_route IS NOT NULL
        LIMIT 1
      ),
      (
        SELECT CASE WHEN COUNT(DISTINCT route) = 1 THEN MIN(route) ELSE NULL END
        FROM (
          SELECT route
          FROM ${MUTATION_IDEMPOTENCY_TABLE}
          WHERE document_slug = ${MUTATION_OUTBOX_TABLE}.document_slug
            AND idempotency_key = ${MUTATION_OUTBOX_TABLE}.idempotency_key
            AND route IS NOT NULL
          UNION ALL
          SELECT route
          FROM idempotency_keys
          WHERE document_slug = ${MUTATION_OUTBOX_TABLE}.document_slug
            AND idempotency_key = ${MUTATION_OUTBOX_TABLE}.idempotency_key
            AND route IS NOT NULL
        ) inferred_routes
      )
    )
    WHERE ${whereClause}
      AND COALESCE(
        (
          SELECT document_events.mutation_route
          FROM document_events
          WHERE document_events.id = ${MUTATION_OUTBOX_TABLE}.event_id
            AND document_events.mutation_route IS NOT NULL
          LIMIT 1
        ),
        (
          SELECT CASE WHEN COUNT(DISTINCT route) = 1 THEN MIN(route) ELSE NULL END
          FROM (
            SELECT route
            FROM ${MUTATION_IDEMPOTENCY_TABLE}
            WHERE document_slug = ${MUTATION_OUTBOX_TABLE}.document_slug
              AND idempotency_key = ${MUTATION_OUTBOX_TABLE}.idempotency_key
              AND route IS NOT NULL
            UNION ALL
            SELECT route
            FROM idempotency_keys
            WHERE document_slug = ${MUTATION_OUTBOX_TABLE}.document_slug
              AND idempotency_key = ${MUTATION_OUTBOX_TABLE}.idempotency_key
              AND route IS NOT NULL
          ) inferred_routes
        )
      ) IS NOT NULL
  `).run(...params));
}
export async function createDocument(slug: string, markdown: string, marks: Record<string, unknown>, title?: string, ownerId?: string, ownerSecret?: string): Promise<DocumentRow> { return withinDomain(async () => {
await getDb().query('SELECT slug FROM documents WHERE slug = $1 FOR UPDATE', [slug]);

    (await assertWritesAllowed('createDocument'));
    const now = new Date().toISOString();
    const d = getDb();
    const docId = randomUUID();
    const collabBootstrapEpoch = (await readMetadataNumber(d, GLOBAL_COLLAB_ADMISSION_EPOCH_METADATA_KEY, 0));
    const ownerSecretHash = ownerSecret ? hashSecret(ownerSecret) : null;
    (await d.prepare(`
    INSERT INTO documents (
      slug, doc_id, title, markdown, marks, revision, y_state_version, share_state, access_epoch, collab_bootstrap_epoch, active,
      owner_id, owner_secret, owner_secret_hash, created_at, updated_at, deleted_at
    )
    VALUES ($1, $2, $3, $4, $5, 1, 0, 'ACTIVE', 0, $6, 1, $7, NULL, $8, $9, $10, NULL)
  `).run(slug, docId, title || null, markdown, JSON.stringify(marks), collabBootstrapEpoch, ownerId || null, ownerSecretHash, now, now));
    (await upsertDocumentProjectionRow(slug, markdown, JSON.stringify(marks), 1, 0, now));
    return (await d.prepare('SELECT * FROM documents WHERE slug = $1').get(slug)) as DocumentRow;

}); }
export async function getDocument(slug: string): Promise<DocumentRow | undefined> { return withinDomain(async () => {

    return (await getDb()
        .prepare('SELECT * FROM documents WHERE slug = $1 AND share_state = \'ACTIVE\'')
        .get(slug)) as DocumentRow | undefined;

}); }
export async function getDocumentBySlug(slug: string): Promise<DocumentRow | undefined> { return withinDomain(async () => {

    return (await getDb()
        .prepare('SELECT * FROM documents WHERE slug = $1')
        .get(slug)) as DocumentRow | undefined;

}); }
export async function getDocumentProjectionBySlug(slug: string): Promise<DocumentProjectionRow | undefined> { return withinDomain(async () => {

    return (await getDb()
        .prepare('SELECT * FROM document_projections WHERE document_slug = $1 LIMIT 1')
        .get(slug)) as DocumentProjectionRow | undefined;

}); }
export async function getProjectedDocumentBySlug(slug: string): Promise<ProjectedDocumentRow | undefined> { return withinDomain(async () => {

    return (await getDb().prepare(`
    SELECT
      d.*,
      d.markdown AS canonical_markdown,
      d.marks AS canonical_marks,
      COALESCE(p.markdown, d.markdown) AS markdown,
      COALESCE(p.marks_json, d.marks) AS marks,
      COALESCE(p.plain_text, d.markdown) AS plain_text,
      COALESCE(p.health, 'projection_stale') AS projection_health,
      p.health_reason AS projection_health_reason,
      p.revision AS projection_revision,
      p.y_state_version AS projection_y_state_version,
      p.updated_at AS projection_updated_at
    FROM documents d
    LEFT JOIN document_projections p
      ON p.document_slug = d.slug
    WHERE d.slug = $1
    LIMIT 1
  `).get(slug)) as ProjectedDocumentRow | undefined;

}); }
export async function setDocumentProjectionHealth(slug: string, health: DocumentProjectionRow['health'], reason: string | null = null): Promise<boolean> { return withinDomain(async () => {
await getDb().query('SELECT slug FROM documents WHERE slug = $1 FOR UPDATE', [slug]);

    (await assertWritesAllowed('setDocumentProjectionHealth'));
    const nextReason = health === 'quarantined'
        ? (reason ?? (await getDocumentProjectionBySlug(slug))?.health_reason ?? null)
        : null;
    const result = (await getDb().prepare(`
    UPDATE document_projections
    SET health = $1, health_reason = $2
    WHERE document_slug = $3
  `).run(health, nextReason, slug));
    if (result.changes > 0)
        return true;
    const row = (await getDocumentBySlug(slug));
    if (!row)
        return false;
    (await upsertDocumentProjectionRow(slug, row.markdown, row.marks, row.revision, row.y_state_version, row.updated_at, health, nextReason));
    return true;

}); }
export async function getDocumentAuthStateBySlug(slug: string): Promise<DocumentAuthStateRow | undefined> { return withinDomain(async () => {

    return (await getDb()
        .prepare(`
      SELECT slug, doc_id, share_state, access_epoch, owner_id, owner_secret, owner_secret_hash
      FROM documents
      WHERE slug = $1
      LIMIT 1
    `)
        .get(slug)) as DocumentAuthStateRow | undefined;

}); }
function getActiveCollabConnectionTtlMs(): number {
    return parsePositiveInt(process.env.ACTIVE_COLLAB_CONNECTION_TTL_MS, DEFAULT_ACTIVE_COLLAB_CONNECTION_TTL_MS);
}
function getDocumentLiveCollabLeaseTtlMs(): number {
    return parsePositiveInt(process.env.DOCUMENT_LIVE_COLLAB_LEASE_TTL_MS, DEFAULT_DOCUMENT_LIVE_COLLAB_LEASE_TTL_MS);
}
async function maybePruneExpiredActiveCollabConnections(nowIso: string): Promise<void> {
    const nowMs = Date.now();
    if (nowMs - lastActiveCollabConnectionPruneAt < DEFAULT_ACTIVE_COLLAB_CONNECTION_PRUNE_INTERVAL_MS)
        return;
    lastActiveCollabConnectionPruneAt = nowMs;
    const cutoffIso = new Date(Date.parse(nowIso) - getActiveCollabConnectionTtlMs()).toISOString();
    (await getDb().prepare(`
    DELETE FROM ${ACTIVE_COLLAB_CONNECTIONS_TABLE}
    WHERE last_seen_at < $1
  `).run(cutoffIso));
}
export async function upsertActiveCollabConnection(input: ActiveCollabConnectionInput): Promise<void> { return withinDomain(async () => {

    (await assertWritesAllowed('upsertActiveCollabConnection'));
    const observedAt = input.observedAt ?? new Date().toISOString();
    (await maybePruneExpiredActiveCollabConnections(observedAt));
    (await getDb().prepare(`
    INSERT INTO ${ACTIVE_COLLAB_CONNECTIONS_TABLE} (
      connection_id,
      document_slug,
      role,
      access_epoch,
      instance_id,
      connected_at,
      last_seen_at
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    ON CONFLICT(connection_id) DO UPDATE SET
      document_slug = excluded.document_slug,
      role = excluded.role,
      access_epoch = excluded.access_epoch,
      instance_id = excluded.instance_id,
      last_seen_at = excluded.last_seen_at
  `).run(input.connectionId, input.slug, input.role, input.accessEpoch, input.instanceId, observedAt, observedAt));

}); }
export async function removeActiveCollabConnection(connectionId: string): Promise<void> { return withinDomain(async () => {

    (await assertWritesAllowed('removeActiveCollabConnection'));
    (await getDb().prepare(`
    DELETE FROM ${ACTIVE_COLLAB_CONNECTIONS_TABLE}
    WHERE connection_id = $1
  `).run(connectionId));

}); }
export async function countActiveCollabConnections(slug: string, accessEpoch?: number | null, observedAt: string = new Date().toISOString()): Promise<number> { return withinDomain(async () => {

    const cutoffIso = new Date(Date.parse(observedAt) - getActiveCollabConnectionTtlMs()).toISOString();
    if (typeof accessEpoch === 'number' && Number.isFinite(accessEpoch)) {
        const row = (await getDb().prepare(`
      SELECT COUNT(*) AS count
      FROM ${ACTIVE_COLLAB_CONNECTIONS_TABLE}
      WHERE document_slug = $1
        AND access_epoch = $2
        AND last_seen_at >= $3
    `).get(slug, accessEpoch, cutoffIso)) as {
            count?: number;
        } | undefined;
        return typeof row?.count === 'number' ? row.count : 0;
    }
    const row = (await getDb().prepare(`
    SELECT COUNT(*) AS count
    FROM ${ACTIVE_COLLAB_CONNECTIONS_TABLE}
    WHERE document_slug = $1
      AND last_seen_at >= $2
  `).get(slug, cutoffIso)) as {
        count?: number;
    } | undefined;
    return typeof row?.count === 'number' ? row.count : 0;

}); }
export async function countActiveCollabConnectionsForInstance(slug: string, instanceId: string, accessEpoch?: number | null, observedAt: string = new Date().toISOString()): Promise<number> { return withinDomain(async () => {

    const cutoffIso = new Date(Date.parse(observedAt) - getActiveCollabConnectionTtlMs()).toISOString();
    if (typeof accessEpoch === 'number' && Number.isFinite(accessEpoch)) {
        const row = (await getDb().prepare(`
      SELECT COUNT(*) AS count
      FROM ${ACTIVE_COLLAB_CONNECTIONS_TABLE}
      WHERE document_slug = $1
        AND instance_id = $2
        AND access_epoch = $3
        AND last_seen_at >= $4
    `).get(slug, instanceId, accessEpoch, cutoffIso)) as {
            count?: number;
        } | undefined;
        return typeof row?.count === 'number' ? row.count : 0;
    }
    const row = (await getDb().prepare(`
    SELECT COUNT(*) AS count
    FROM ${ACTIVE_COLLAB_CONNECTIONS_TABLE}
    WHERE document_slug = $1
      AND instance_id = $2
      AND last_seen_at >= $3
  `).get(slug, instanceId, cutoffIso)) as {
        count?: number;
    } | undefined;
    return typeof row?.count === 'number' ? row.count : 0;

}); }
export async function listActiveCollabConnectionSlugs(observedAt: string = new Date().toISOString()): Promise<string[]> { return withinDomain(async () => {

    const cutoffIso = new Date(Date.parse(observedAt) - getActiveCollabConnectionTtlMs()).toISOString();
    const rows = (await getDb().prepare(`
    SELECT DISTINCT document_slug AS slug
    FROM ${ACTIVE_COLLAB_CONNECTIONS_TABLE}
    WHERE last_seen_at >= $1
  `).all(cutoffIso)) as Array<{
        slug?: string | null;
    }>;
    return rows
        .map((row) => (typeof row.slug === 'string' ? row.slug.trim() : ''))
        .filter((slug) => slug.length > 0);

}); }
export async function noteDocumentLiveCollabLease(slug: string, accessEpoch: number, observedAt: string = new Date().toISOString()): Promise<void> { return withinDomain(async () => {
await getDb().query('SELECT slug FROM documents WHERE slug = $1 FOR UPDATE', [slug]);

    (await assertWritesAllowed('noteDocumentLiveCollabLease'));
    (await getDb().prepare(`
    UPDATE documents
    SET live_collab_seen_at = $1, live_collab_access_epoch = $2
    WHERE slug = $3 AND share_state IN ('ACTIVE', 'PAUSED')
  `).run(observedAt, accessEpoch, slug));

}); }
export async function getRecentDocumentLiveCollabLeaseBreakdown(slug: string, accessEpoch?: number | null, observedAt: string = new Date().toISOString()): Promise<{
    exactEpochCount: number;
    anyEpochCount: number;
}> { return withinDomain(async () => {

    const cutoffIso = new Date(Date.parse(observedAt) - getDocumentLiveCollabLeaseTtlMs()).toISOString();
    const row = (await getDb().prepare(`
    SELECT live_collab_seen_at AS "seenAt", live_collab_access_epoch AS "leaseEpoch"
    FROM documents
    WHERE slug = $1
    LIMIT 1
  `).get(slug)) as {
        seenAt?: string | null;
        leaseEpoch?: number | null;
    } | undefined;
    const seenAt = typeof row?.seenAt === 'string' ? row.seenAt : null;
    if (!seenAt || seenAt < cutoffIso) {
        return { exactEpochCount: 0, anyEpochCount: 0 };
    }
    const leaseEpoch = typeof row?.leaseEpoch === 'number' && Number.isFinite(row.leaseEpoch)
        ? row.leaseEpoch
        : null;
    const exactEpochCount = typeof accessEpoch === 'number' && Number.isFinite(accessEpoch) && leaseEpoch === accessEpoch
        ? 1
        : 0;
    return {
        exactEpochCount,
        anyEpochCount: 1,
    };

}); }
export async function listRecentDocumentLiveCollabLeaseSlugs(observedAt: string = new Date().toISOString()): Promise<string[]> { return withinDomain(async () => {

    const cutoffIso = new Date(Date.parse(observedAt) - getDocumentLiveCollabLeaseTtlMs()).toISOString();
    const rows = (await getDb().prepare(`
    SELECT slug
    FROM documents
    WHERE share_state IN ('ACTIVE', 'PAUSED')
      AND live_collab_seen_at IS NOT NULL
      AND live_collab_seen_at >= $1
  `).all(cutoffIso)) as Array<{
        slug?: string | null;
    }>;
    return rows
        .map((row) => (typeof row.slug === 'string' ? row.slug.trim() : ''))
        .filter((slug) => slug.length > 0);

}); }
export async function listActiveDocuments(): Promise<DocumentRow[]> { return withinDomain(async () => {

    return (await getDb()
        .prepare('SELECT * FROM documents WHERE share_state = \'ACTIVE\'')
        .all()) as DocumentRow[];

}); }
export async function updateDocument(slug: string, markdown: string, marks?: Record<string, unknown>, yStateVersion?: number): Promise<boolean> { return withinDomain(async () => {
await getDb().query('SELECT slug FROM documents WHERE slug = $1 FOR UPDATE', [slug]);

    (await assertWritesAllowed('updateDocument'));
    const now = new Date().toISOString();
    if (marks !== undefined) {
        if (yStateVersion !== undefined) {
            const result = (await getDb().prepare(`
        UPDATE documents
        SET markdown = $1, marks = $2, updated_at = $3, revision = revision + 1, y_state_version = $4
        WHERE slug = $5 AND share_state IN ('ACTIVE', 'PAUSED')
      `).run(markdown, JSON.stringify(marks), now, yStateVersion, slug));
            if (result.changes > 0) {
                const updated = (await getDocumentBySlug(slug));
                if (updated)
                    (await upsertDocumentProjectionRow(slug, updated.markdown, updated.marks, updated.revision, updated.y_state_version, updated.updated_at));
            }
            return result.changes > 0;
        }
        const result = (await getDb().prepare(`
      UPDATE documents
      SET markdown = $1, marks = $2, updated_at = $3, revision = revision + 1
      WHERE slug = $4 AND share_state IN ('ACTIVE', 'PAUSED')
    `).run(markdown, JSON.stringify(marks), now, slug));
        if (result.changes > 0) {
            const updated = (await getDocumentBySlug(slug));
            if (updated)
                (await upsertDocumentProjectionRow(slug, updated.markdown, updated.marks, updated.revision, updated.y_state_version, updated.updated_at));
        }
        return result.changes > 0;
    }
    if (yStateVersion !== undefined) {
        const result = (await getDb().prepare(`
      UPDATE documents
      SET markdown = $1, updated_at = $2, revision = revision + 1, y_state_version = $3
      WHERE slug = $4 AND share_state IN ('ACTIVE', 'PAUSED')
    `).run(markdown, now, yStateVersion, slug));
        if (result.changes > 0) {
            const updated = (await getDocumentBySlug(slug));
            if (updated)
                (await upsertDocumentProjectionRow(slug, updated.markdown, updated.marks, updated.revision, updated.y_state_version, updated.updated_at));
        }
        return result.changes > 0;
    }
    const result = (await getDb().prepare(`
    UPDATE documents
    SET markdown = $1, updated_at = $2, revision = revision + 1
    WHERE slug = $3 AND share_state IN ('ACTIVE', 'PAUSED')
  `).run(markdown, now, slug));
    if (result.changes > 0) {
        const updated = (await getDocumentBySlug(slug));
        if (updated)
            (await upsertDocumentProjectionRow(slug, updated.markdown, updated.marks, updated.revision, updated.y_state_version, updated.updated_at));
    }
    return result.changes > 0;

}); }
export async function updateDocumentTitle(slug: string, title: string | null): Promise<boolean> { return withinDomain(async () => {
await getDb().query('SELECT slug FROM documents WHERE slug = $1 FOR UPDATE', [slug]);

    (await assertWritesAllowed('updateDocumentTitle'));
    const now = new Date().toISOString();
    const result = (await getDb().prepare(`
    UPDATE documents
    SET title = $1, updated_at = $2
    WHERE slug = $3 AND share_state IN ('ACTIVE', 'PAUSED')
  `).run(title, now, slug));
    return result.changes > 0;

}); }
export async function updateDocumentAtomic(slug: string, expectedUpdatedAt: string, markdown: string, marks?: Record<string, unknown>): Promise<boolean> { return withinDomain(async () => {
await getDb().query('SELECT slug FROM documents WHERE slug = $1 FOR UPDATE', [slug]);

    (await assertWritesAllowed('updateDocumentAtomic'));
    const now = new Date().toISOString();
    if (marks !== undefined) {
        const result = (await getDb().prepare(`
      UPDATE documents
      SET markdown = $1, marks = $2, updated_at = $3, revision = revision + 1
      WHERE slug = $4 AND updated_at = $5 AND share_state IN ('ACTIVE', 'PAUSED')
    `).run(markdown, JSON.stringify(marks), now, slug, expectedUpdatedAt));
        if (result.changes > 0) {
            const updated = (await getDocumentBySlug(slug));
            if (updated)
                (await upsertDocumentProjectionRow(slug, updated.markdown, updated.marks, updated.revision, updated.y_state_version, updated.updated_at));
        }
        return result.changes > 0;
    }
    const result = (await getDb().prepare(`
    UPDATE documents
    SET markdown = $1, updated_at = $2, revision = revision + 1
    WHERE slug = $3 AND updated_at = $4 AND share_state IN ('ACTIVE', 'PAUSED')
  `).run(markdown, now, slug, expectedUpdatedAt));
    if (result.changes > 0) {
        const updated = (await getDocumentBySlug(slug));
        if (updated)
            (await upsertDocumentProjectionRow(slug, updated.markdown, updated.marks, updated.revision, updated.y_state_version, updated.updated_at));
    }
    return result.changes > 0;

}); }
export async function updateDocumentAtomicByRevision(slug: string, expectedRevision: number, markdown: string, marks?: Record<string, unknown>): Promise<boolean> { return withinDomain(async () => {
await getDb().query('SELECT slug FROM documents WHERE slug = $1 FOR UPDATE', [slug]);

    (await assertWritesAllowed('updateDocumentAtomicByRevision'));
    const now = new Date().toISOString();
    if (marks !== undefined) {
        const result = (await getDb().prepare(`
      UPDATE documents
      SET markdown = $1, marks = $2, updated_at = $3, revision = revision + 1
      WHERE slug = $4 AND revision = $5 AND share_state IN ('ACTIVE', 'PAUSED')
    `).run(markdown, JSON.stringify(marks), now, slug, expectedRevision));
        if (result.changes > 0) {
            const updated = (await getDocumentBySlug(slug));
            if (updated)
                (await upsertDocumentProjectionRow(slug, updated.markdown, updated.marks, updated.revision, updated.y_state_version, updated.updated_at));
        }
        return result.changes > 0;
    }
    const result = (await getDb().prepare(`
    UPDATE documents
    SET markdown = $1, updated_at = $2, revision = revision + 1
    WHERE slug = $3 AND revision = $4 AND share_state IN ('ACTIVE', 'PAUSED')
  `).run(markdown, now, slug, expectedRevision));
    if (result.changes > 0) {
        const updated = (await getDocumentBySlug(slug));
        if (updated)
            (await upsertDocumentProjectionRow(slug, updated.markdown, updated.marks, updated.revision, updated.y_state_version, updated.updated_at));
    }
    return result.changes > 0;

}); }
export async function updateMarks(slug: string, marks: Record<string, unknown>): Promise<boolean> { return withinDomain(async () => {
await getDb().query('SELECT slug FROM documents WHERE slug = $1 FOR UPDATE', [slug]);

    (await assertWritesAllowed('updateMarks'));
    const now = new Date().toISOString();
    const result = (await getDb().prepare(`
    UPDATE documents
    SET marks = $1, updated_at = $2
    WHERE slug = $3 AND share_state IN ('ACTIVE', 'PAUSED')
  `).run(JSON.stringify(marks), now, slug));
    if (result.changes > 0) {
        const updated = (await getDocumentBySlug(slug));
        if (updated)
            (await upsertDocumentProjectionRow(slug, updated.markdown, updated.marks, updated.revision, updated.y_state_version, updated.updated_at));
    }
    return result.changes > 0;

}); }
export async function replaceDocumentProjection(slug: string, markdown: string, marks: Record<string, unknown>, yStateVersion?: number, options?: {
    health?: DocumentProjectionRow['health'];
    healthReason?: string | null;
}): Promise<boolean> { return withinDomain(async () => {
await getDb().query('SELECT slug FROM documents WHERE slug = $1 FOR UPDATE', [slug]);

    (await assertWritesAllowed('replaceDocumentProjection'));
    const current = (await getDocumentBySlug(slug));
    if (!current || !['ACTIVE', 'PAUSED'].includes(current.share_state))
        return false;
    let nextYStateVersion = typeof current.y_state_version === 'number' ? current.y_state_version : 0;
    const projectionRow = (await getDocumentProjectionBySlug(slug));
    if (yStateVersion !== undefined) {
        const syncResult = (await getDb().prepare(`
      UPDATE documents
      SET y_state_version = $1
      WHERE slug = $2 AND share_state IN ('ACTIVE', 'PAUSED')
    `).run(yStateVersion, slug));
        if (syncResult.changes === 0)
            return false;
        nextYStateVersion = yStateVersion;
    }
    const nextHealth = options?.health ?? projectionRow?.health ?? 'healthy';
    const nextHealthReason = nextHealth === 'quarantined'
        ? options?.healthReason ?? projectionRow?.health_reason ?? null
        : null;
    (await upsertDocumentProjectionRow(slug, markdown, JSON.stringify(marks), current.revision, nextYStateVersion, current.updated_at, nextHealth, nextHealthReason));
    return true;

}); }
type BlockDescriptor = {
    ordinal: number;
    node_type: string;
    attrs_json: string;
    markdown: string;
    markdown_hash: string;
    text_preview: string;
};
function hashMarkdown(markdown: string): string {
    return createHash('sha256').update(markdown).digest('hex');
}
function buildTextPreview(text: string, limit: number = 200): string {
    const normalized = text.replace(/\s+/g, ' ').trim();
    if (!normalized)
        return '';
    return normalized.length > limit ? normalized.slice(0, limit) : normalized;
}
async function buildBlockDescriptors(markdown: string): Promise<BlockDescriptor[]> {
    const parser = await getHeadlessMilkdownParser();
    const parsed = parseMarkdownWithHtmlFallback(parser, markdown ?? '');
    if (!parsed.doc) {
        throw new Error(`Failed to parse markdown into blocks: ${summarizeParseError(parsed.error)}`);
    }
    const doc = parsed.doc;
    const blocks: BlockDescriptor[] = [];
    for (let i = 0; i < doc.childCount; i += 1) {
        const node = doc.child(i);
        const blockMarkdown = await serializeSingleNode(node);
        blocks.push({
            ordinal: i + 1,
            node_type: node.type.name,
            attrs_json: JSON.stringify(node.attrs ?? {}),
            markdown: blockMarkdown,
            markdown_hash: hashMarkdown(blockMarkdown),
            text_preview: buildTextPreview(node.textContent),
        });
    }
    return blocks;
}
function blockKey(block: {
    node_type: string;
    markdown_hash: string;
}): string {
    return `${block.node_type}::${block.markdown_hash}`;
}
function computeLcsMatches(a: string[], b: string[]): Array<[
    number,
    number
]> {
    const dp: number[][] = Array.from({ length: a.length + 1 }, () => new Array(b.length + 1).fill(0));
    for (let i = a.length - 1; i >= 0; i -= 1) {
        for (let j = b.length - 1; j >= 0; j -= 1) {
            if (a[i] === b[j]) {
                dp[i][j] = dp[i + 1][j + 1] + 1;
            }
            else {
                dp[i][j] = Math.max(dp[i + 1][j], dp[i][j + 1]);
            }
        }
    }
    const matches: Array<[
        number,
        number
    ]> = [];
    let i = 0;
    let j = 0;
    while (i < a.length && j < b.length) {
        if (a[i] === b[j]) {
            matches.push([i, j]);
            i += 1;
            j += 1;
        }
        else if (dp[i + 1][j] >= dp[i][j + 1]) {
            i += 1;
        }
        else {
            j += 1;
        }
    }
    return matches;
}
function matchBlocks(oldBlocks: DocumentBlockRow[], newBlocks: BlockDescriptor[]): Map<number, number> {
    const matches = new Map<number, number>();
    const usedOld = new Set<number>();
    const usedNew = new Set<number>();
    const max = Math.min(oldBlocks.length, newBlocks.length);
    for (let i = 0; i < max; i += 1) {
        if (blockKey(oldBlocks[i]) === blockKey(newBlocks[i])) {
            matches.set(i, i);
            usedOld.add(i);
            usedNew.add(i);
        }
    }
    const remainingOld = oldBlocks.map((_, idx) => idx).filter((idx) => !usedOld.has(idx));
    const remainingNew = newBlocks.map((_, idx) => idx).filter((idx) => !usedNew.has(idx));
    if (remainingOld.length && remainingNew.length) {
        const oldKeys = remainingOld.map((idx) => blockKey(oldBlocks[idx]));
        const newKeys = remainingNew.map((idx) => blockKey(newBlocks[idx]));
        const lcsMatches = computeLcsMatches(oldKeys, newKeys);
        for (const [oldIdx, newIdx] of lcsMatches) {
            const oldIndex = remainingOld[oldIdx];
            const newIndex = remainingNew[newIdx];
            matches.set(newIndex, oldIndex);
            usedOld.add(oldIndex);
            usedNew.add(newIndex);
        }
    }
    const stillOld = oldBlocks.map((_, idx) => idx).filter((idx) => !usedOld.has(idx));
    const stillNew = newBlocks.map((_, idx) => idx).filter((idx) => !usedNew.has(idx));
    for (const newIndex of stillNew) {
        const candidates = stillOld.filter((idx) => blockKey(oldBlocks[idx]) === blockKey(newBlocks[newIndex]));
        if (candidates.length === 1) {
            matches.set(newIndex, candidates[0]);
            usedOld.add(candidates[0]);
            usedNew.add(newIndex);
            continue;
        }
        if (candidates.length > 1) {
            let prevOld = -Infinity;
            let nextOld = Infinity;
            for (let i = newIndex - 1; i >= 0; i -= 1) {
                const match = matches.get(i);
                if (match !== undefined) {
                    prevOld = match;
                    break;
                }
            }
            for (let i = newIndex + 1; i < newBlocks.length; i += 1) {
                const match = matches.get(i);
                if (match !== undefined) {
                    nextOld = match;
                    break;
                }
            }
            const constrained = candidates.filter((idx) => idx > prevOld && idx < nextOld);
            if (constrained.length === 1) {
                matches.set(newIndex, constrained[0]);
                usedOld.add(constrained[0]);
                usedNew.add(newIndex);
            }
        }
    }
    return matches;
}
export async function listLiveDocumentBlocks(documentId: string): Promise<DocumentBlockRow[]> { return withinDomain(async () => {

    return (await getDb().prepare(`
    SELECT *
    FROM document_blocks
    WHERE document_id = $1 AND retired_revision IS NULL
    ORDER BY ordinal ASC
  `).all(documentId)) as DocumentBlockRow[];

}); }
export async function listDocumentBlocks(documentId: string): Promise<DocumentBlockRow[]> { return withinDomain(async () => {

    return (await getDb().prepare(`
    SELECT *
    FROM document_blocks
    WHERE document_id = $1
    ORDER BY ordinal ASC
  `).all(documentId)) as DocumentBlockRow[];

}); }
export async function rebuildDocumentBlocks(document: DocumentRow, markdown: string, revision: number): Promise<DocumentBlockRow[]> { return withinDomain(async () => {

    (await assertWritesAllowed('rebuildDocumentBlocks'));
    if (!document.doc_id) {
        throw new Error('Document is missing doc_id; cannot rebuild block index.');
    }
    const documentId = document.doc_id;
    const oldBlocks = (await listLiveDocumentBlocks(documentId));
    const newBlocks = await buildBlockDescriptors(markdown);
    const matches = matchBlocks(oldBlocks, newBlocks);
    const nextBlocks = newBlocks.map((block, index) => {
        const oldIndex = matches.get(index);
        const existing = oldIndex !== undefined ? oldBlocks[oldIndex] : null;
        return {
            document_id: documentId,
            block_id: existing?.block_id ?? randomUUID(),
            ordinal: block.ordinal,
            node_type: block.node_type,
            attrs_json: block.attrs_json,
            markdown_hash: block.markdown_hash,
            text_preview: block.text_preview,
            created_revision: existing?.created_revision ?? revision,
            last_seen_revision: revision,
            retired_revision: null,
        } satisfies DocumentBlockRow;
    });
    const oldBlockIds = new Set(oldBlocks.map((block) => block.block_id));
    const usedOldIds = new Set<string>(nextBlocks.map((block) => block.block_id));
    const retiredOld = oldBlocks.filter((block) => !usedOldIds.has(block.block_id));
    const db = getDb();
    const updateTemp = db.prepare(`
    UPDATE document_blocks
    SET ordinal = $1, node_type = $2, attrs_json = $3, markdown_hash = $4, text_preview = $5, last_seen_revision = $6, retired_revision = NULL
    WHERE document_id = $7 AND block_id = $8
  `);
    const updateOrdinal = db.prepare(`
    UPDATE document_blocks
    SET ordinal = $1
    WHERE document_id = $2 AND block_id = $3
  `);
    const retire = db.prepare(`
    UPDATE document_blocks
    SET retired_revision = $1
    WHERE document_id = $2 AND block_id = $3 AND retired_revision IS NULL
  `);
    const insert = db.prepare(`
    INSERT INTO document_blocks (
      document_id, block_id, ordinal, node_type, attrs_json, markdown_hash, text_preview,
      created_revision, last_seen_revision, retired_revision
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NULL)
  `);
    const tx = async () => await db.transaction(async () => {
        for (const block of retiredOld) {
            (await retire.run(revision, documentId, block.block_id));
        }
        for (let i = 0; i < nextBlocks.length; i += 1) {
            const block = nextBlocks[i];
            if (oldBlockIds.has(block.block_id)) {
                (await updateTemp.run(-(i + 1), block.node_type, block.attrs_json, block.markdown_hash, block.text_preview, revision, documentId, block.block_id));
            }
        }
        for (const block of nextBlocks) {
            if (!oldBlockIds.has(block.block_id)) {
                (await insert.run(block.document_id, block.block_id, block.ordinal, block.node_type, block.attrs_json, block.markdown_hash, block.text_preview, block.created_revision, block.last_seen_revision));
            }
        }
        for (const block of nextBlocks) {
            if (oldBlockIds.has(block.block_id)) {
                (await updateOrdinal.run(block.ordinal, documentId, block.block_id));
            }
        }
    });
    (await tx());
    return (await listLiveDocumentBlocks(documentId));

}); }
async function updateShareState(slug: string, state: ShareState): Promise<boolean> {
    (await assertWritesAllowed('updateShareState'));
    const now = new Date().toISOString();
    if (state === 'DELETED') {
        const result = (await getDb().prepare(`
      UPDATE documents
      SET share_state = $1, active = 0, deleted_at = $2, updated_at = $3, access_epoch = access_epoch + 1
      WHERE slug = $4
    `).run(state, now, now, slug));
        return result.changes > 0;
    }
    const active = state === 'ACTIVE' ? 1 : 0;
    const result = (await getDb().prepare(`
    UPDATE documents
    SET share_state = $1, active = $2, deleted_at = NULL, updated_at = $3, access_epoch = CASE WHEN $4 = 'ACTIVE' THEN access_epoch ELSE access_epoch + 1 END
    WHERE slug = $5
  `).run(state, active, now, state, slug));
    return result.changes > 0;
}
export async function pauseDocument(slug: string): Promise<boolean> { return withinDomain(async () => {

    return (await updateShareState(slug, 'PAUSED'));

}); }
export async function resumeDocument(slug: string): Promise<boolean> { return withinDomain(async () => {

    return (await updateShareState(slug, 'ACTIVE'));

}); }
export async function revokeDocument(slug: string): Promise<boolean> { return withinDomain(async () => {

    return (await updateShareState(slug, 'REVOKED'));

}); }
export async function deleteDocument(slug: string): Promise<boolean> { return withinDomain(async () => {

    return (await updateShareState(slug, 'DELETED'));

}); }
export async function deactivateDocument(slug: string): Promise<boolean> { return withinDomain(async () => {

    return (await pauseDocument(slug));

}); }
export async function addEvent(slug: string, eventType: string, eventData: unknown, actor: string): Promise<void> { return withinDomain(async () => {
await getDb().query('SELECT slug FROM documents WHERE slug = $1 FOR UPDATE', [slug]);

    (await assertWritesAllowed('addEvent'));
    const now = new Date().toISOString();
    const payload = JSON.stringify(eventData);
    const d = getDb();
    const tx = async () => await d.transaction(async () => {
        const documentRevision = (await getDocumentRevisionForSlug(d, slug));
        (await d.prepare(`
      INSERT INTO events (document_slug, event_type, event_data, actor, created_at)
      VALUES ($1, $2, $3, $4, $5)
     RETURNING id`).run(slug, eventType, payload, actor, now));
        const result = (await d.prepare(`
      INSERT INTO document_events (
        document_slug, document_revision, event_type, event_data, actor, idempotency_key, tombstone_revision, created_at
      )
      VALUES ($1, $2, $3, $4, $5, NULL, NULL, $6)
     RETURNING id`).run(slug, documentRevision, eventType, payload, actor, now));
        const eventId = Number(result.insertedId);
        (await d.prepare(`
      INSERT INTO ${MUTATION_OUTBOX_TABLE} (
        document_slug, document_revision, event_id, event_type, event_data, actor, idempotency_key, tombstone_revision, created_at, delivered_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, NULL, NULL, $7, NULL)
     RETURNING id`).run(slug, documentRevision, eventId, eventType, payload, actor, now));
    });
    (await tx());

}); }
export async function addDocumentEvent(slug: string, eventType: string, eventData: unknown, actor: string, idempotencyKey?: string, mutationRoute?: string): Promise<number> { return withinDomain(async () => {
await getDb().query('SELECT slug FROM documents WHERE slug = $1 FOR UPDATE', [slug]);

    (await assertWritesAllowed('addDocumentEvent'));
    const now = new Date().toISOString();
    const payload = JSON.stringify(eventData);
    const d = getDb();
    const tx = async () => await d.transaction(async () => {
        const documentRevision = (await getDocumentRevisionForSlug(d, slug));
        const result = (await d.prepare(`
      INSERT INTO document_events (
        document_slug, document_revision, event_type, event_data, actor, idempotency_key, mutation_route, tombstone_revision, created_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, NULL, $8)
     RETURNING id`).run(slug, documentRevision, eventType, payload, actor, idempotencyKey ?? null, mutationRoute ?? null, now));
        const eventId = Number(result.insertedId);
        (await d.prepare(`
      INSERT INTO ${MUTATION_OUTBOX_TABLE} (
        document_slug, document_revision, event_id, event_type, event_data, actor, idempotency_key, mutation_route, tombstone_revision, created_at, delivered_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NULL, $9, NULL)
     RETURNING id`).run(slug, documentRevision, eventId, eventType, payload, actor, idempotencyKey ?? null, mutationRoute ?? null, now));
        return eventId;
    });
    return (await tx());

}); }
export async function listDocumentEvents(slug: string, afterId: number, limit: number = DEFAULT_EVENT_PAGE_SIZE): Promise<DocumentEventRow[]> { return withinDomain(async () => {

    const safeLimit = Math.max(1, Math.min(limit, 500));
    return (await getDb().prepare(`
    SELECT * FROM document_events
    WHERE document_slug = $1 AND id > $2
    ORDER BY id ASC
    LIMIT $3
  `).all(slug, afterId, safeLimit)) as DocumentEventRow[];

}); }
export async function ackDocumentEvents(slug: string, upToId: number, ackedBy: string): Promise<number> { return withinDomain(async () => {
await getDb().query('SELECT slug FROM documents WHERE slug = $1 FOR UPDATE', [slug]);

    (await assertWritesAllowed('ackDocumentEvents'));
    const now = new Date().toISOString();
    const result = (await getDb().prepare(`
    UPDATE document_events
    SET acked_by = $1, acked_at = $2
    WHERE document_slug = $3 AND id <= $4 AND acked_at IS NULL
  `).run(ackedBy, now, slug, upToId));
    return result.changes;

}); }
export async function createDocumentAccessToken(slug: string, role: ShareRole, providedSecret?: string): Promise<{
    tokenId: string;
    role: ShareRole;
    secret: string;
    createdAt: string;
}> { return withinDomain(async () => {
await getDb().query('SELECT slug FROM documents WHERE slug = $1 FOR UPDATE', [slug]);

    (await assertWritesAllowed('createDocumentAccessToken'));
    const now = new Date().toISOString();
    const secret = providedSecret ?? randomUUID();
    const tokenId = randomUUID();
    (await getDb().prepare(`
    INSERT INTO document_access (token_id, document_slug, role, secret_hash, created_at, revoked_at)
    VALUES ($1, $2, $3, $4, $5, NULL)
  `).run(tokenId, slug, role, hashSecret(secret), now));
    return { tokenId, role, secret, createdAt: now };

}); }
export async function revokeDocumentAccessTokens(slug: string, role?: ShareRole, options?: {
    bumpEpoch?: boolean;
}): Promise<number> { return withinDomain(async () => {
await getDb().query('SELECT slug FROM documents WHERE slug = $1 FOR UPDATE', [slug]);

    (await assertWritesAllowed('revokeDocumentAccessTokens'));
    const now = new Date().toISOString();
    const shouldBumpEpoch = options?.bumpEpoch !== false;
    let changes = 0;
    if (role) {
        const result = (await getDb().prepare(`
      UPDATE document_access
      SET revoked_at = $1
      WHERE document_slug = $2 AND role = $3 AND revoked_at IS NULL
    `).run(now, slug, role));
        changes = result.changes;
        if (changes > 0 && shouldBumpEpoch) {
            (await bumpDocumentAccessEpoch(slug));
        }
        return changes;
    }
    const result = (await getDb().prepare(`
    UPDATE document_access
    SET revoked_at = $1
    WHERE document_slug = $2 AND revoked_at IS NULL
  `).run(now, slug));
    changes = result.changes;
    if (changes > 0 && shouldBumpEpoch) {
        (await bumpDocumentAccessEpoch(slug));
    }
    return changes;

}); }
export type DocumentAccessResolution = {
    role: ShareRole;
    tokenId: string | null;
    source: 'owner_secret' | 'owner_secret_legacy' | 'access_token';
};
export async function resolveDocumentAccess(slug: string, presentedSecret: string): Promise<DocumentAccessResolution | null> { return withinDomain(async () => {

    if (!presentedSecret)
        return null;
    const hashed = hashSecret(presentedSecret);
    const doc = (await getDocumentAuthStateBySlug(slug));
    if (!doc)
        return null;
    if (doc.owner_secret_hash && timingSafeEqualString(doc.owner_secret_hash, hashed)) {
        return { role: 'owner_bot', tokenId: null, source: 'owner_secret' };
    }
    if (doc.owner_secret && timingSafeEqualString(doc.owner_secret, presentedSecret)) {
        return { role: 'owner_bot', tokenId: null, source: 'owner_secret_legacy' };
    }
    const row = (await getDb().prepare(`
    SELECT token_id, role
    FROM document_access
    WHERE document_slug = $1 AND secret_hash = $2 AND revoked_at IS NULL
    LIMIT 1
  `).get(slug, hashed)) as {
        token_id?: string;
        role?: ShareRole;
    } | undefined;
    if (!row?.role)
        return null;
    return {
        role: row.role,
        tokenId: row.token_id ?? null,
        source: 'access_token',
    };

}); }
export async function resolveDocumentAccessRole(slug: string, presentedSecret: string): Promise<ShareRole | null> { return withinDomain(async () => {

    return (await resolveDocumentAccess(slug, presentedSecret))?.role ?? null;

}); }
export async function bumpDocumentAccessEpoch(slug: string): Promise<number | null> { return withinDomain(async () => {
await getDb().query('SELECT slug FROM documents WHERE slug = $1 FOR UPDATE', [slug]);

    (await assertWritesAllowed('bumpDocumentAccessEpoch'));
    const now = new Date().toISOString();
    const result = (await getDb().prepare(`
    UPDATE documents
    SET access_epoch = access_epoch + 1, updated_at = $1
    WHERE slug = $2
  `).run(now, slug));
    if (result.changes <= 0)
        return null;
    const row = (await getDb().prepare(`
    SELECT access_epoch
    FROM documents
    WHERE slug = $1
    LIMIT 1
  `).get(slug)) as {
        access_epoch?: number;
    } | undefined;
    return typeof row?.access_epoch === 'number' ? row.access_epoch : null;

}); }
export function canMutateByOwnerIdentity(doc: Pick<DocumentRow, 'owner_secret' | 'owner_secret_hash' | 'owner_id'>, ownerSecret: unknown): boolean {
    if (typeof ownerSecret === 'string' && ownerSecret.length > 0) {
        const ownerSecretHash = hashSecret(ownerSecret);
        if (doc.owner_secret_hash && timingSafeEqualString(doc.owner_secret_hash, ownerSecretHash)) {
            return true;
        }
        if (doc.owner_secret && timingSafeEqualString(doc.owner_secret, ownerSecret)) {
            return true;
        }
    }
    return false;
}
function parseStoredResponse(value: string | undefined): Record<string, unknown> | null {
    if (!value)
        return null;
    try {
        return JSON.parse(value) as Record<string, unknown>;
    }
    catch {
        return null;
    }
}
type CoordinatorIdempotencyRow = {
    response_json?: string;
    request_hash?: string | null;
    status_code?: number | null;
    tombstone_revision?: number | null;
    state?: string | null;
    created_at?: string;
    completed_at?: string | null;
    lease_expires_at?: string | null;
    last_seen_at?: string | null;
};
type LegacyIdempotencyRow = {
    response_json?: string;
    request_hash?: string | null;
};
async function readCoordinatorIdempotencyRow(documentSlug: string, route: string, idempotencyKey: string): Promise<CoordinatorIdempotencyRow | undefined> {
    return (await getDb().prepare(`
    SELECT response_json, request_hash, status_code, tombstone_revision, state, created_at, completed_at, lease_expires_at, last_seen_at
    FROM ${MUTATION_IDEMPOTENCY_TABLE}
    WHERE idempotency_key = $1 AND document_slug = $2 AND route = $3
    LIMIT 1
  `).get(idempotencyKey, documentSlug, route)) as CoordinatorIdempotencyRow | undefined;
}
async function readLegacyIdempotencyRow(documentSlug: string, route: string, idempotencyKey: string): Promise<LegacyIdempotencyRow | undefined> {
    return (await getDb().prepare(`
    SELECT response_json, request_hash
    FROM idempotency_keys
    WHERE idempotency_key = $1 AND document_slug = $2 AND route = $3
    LIMIT 1
  `).get(idempotencyKey, documentSlug, route)) as LegacyIdempotencyRow | undefined;
}
export async function getStoredIdempotencyResult(documentSlug: string, route: string, idempotencyKey: string): Promise<Record<string, unknown> | null> { return withinDomain(async () => {

    const coordinatorRow = (await readCoordinatorIdempotencyRow(documentSlug, route, idempotencyKey));
    const legacyRow = (await readLegacyIdempotencyRow(documentSlug, route, idempotencyKey));
    const completedCoordinator = coordinatorRow?.state === 'completed' ? coordinatorRow : undefined;
    if (completedCoordinator && legacyRow) {
        if (completedCoordinator.response_json === legacyRow.response_json) {
            recordMutationIdempotencyDualRead('parity_match', route);
        }
        else {
            recordMutationIdempotencyDualRead('parity_mismatch', route);
            console.warn('[db] idempotency dual-read parity mismatch', { documentSlug, route, idempotencyKey });
        }
    }
    else if (completedCoordinator) {
        recordMutationIdempotencyDualRead('new_only', route);
    }
    else if (legacyRow) {
        recordMutationIdempotencyDualRead('legacy_fallback', route);
    }
    const row = completedCoordinator ?? legacyRow;
    return parseStoredResponse(row?.response_json);

}); }
export async function getStoredIdempotencyRecord(documentSlug: string, route: string, idempotencyKey: string): Promise<{
    response: Record<string, unknown>;
    requestHash: string | null;
} | null> { return withinDomain(async () => {

    const coordinatorRow = (await readCoordinatorIdempotencyRow(documentSlug, route, idempotencyKey));
    const legacyRow = (await readLegacyIdempotencyRow(documentSlug, route, idempotencyKey));
    const completedCoordinator = coordinatorRow?.state === 'completed' ? coordinatorRow : undefined;
    if (completedCoordinator && legacyRow) {
        const responseParity = completedCoordinator.response_json === legacyRow.response_json;
        const hashParity = (completedCoordinator.request_hash ?? null) === (legacyRow.request_hash ?? null);
        if (responseParity && hashParity) {
            recordMutationIdempotencyDualRead('parity_match', route);
        }
        else {
            recordMutationIdempotencyDualRead('parity_mismatch', route);
            console.warn('[db] idempotency record dual-read parity mismatch', { documentSlug, route, idempotencyKey });
        }
    }
    else if (completedCoordinator) {
        recordMutationIdempotencyDualRead('new_hit', route);
    }
    else if (legacyRow) {
        recordMutationIdempotencyDualRead('legacy_fallback', route);
    }
    const row = completedCoordinator ?? legacyRow;
    const response = parseStoredResponse(row?.response_json);
    if (!response)
        return null;
    return {
        response,
        requestHash: typeof row?.request_hash === 'string' ? row.request_hash : null,
    };

}); }
export async function getMutationIdempotencyRecord(documentSlug: string, route: string, idempotencyKey: string): Promise<MutationIdempotencyRecord | null> { return withinDomain(async () => {

    const coordinatorRow = (await readCoordinatorIdempotencyRow(documentSlug, route, idempotencyKey));
    if (coordinatorRow) {
        return {
            state: coordinatorRow.state === 'pending' ? 'pending' : 'completed',
            response: coordinatorRow.state === 'completed' ? parseStoredResponse(coordinatorRow.response_json) : null,
            requestHash: typeof coordinatorRow.request_hash === 'string' ? coordinatorRow.request_hash : null,
            statusCode: typeof coordinatorRow.status_code === 'number' ? coordinatorRow.status_code : null,
            tombstoneRevision: typeof coordinatorRow.tombstone_revision === 'number' ? coordinatorRow.tombstone_revision : null,
            createdAt: coordinatorRow.created_at ?? new Date(0).toISOString(),
            completedAt: typeof coordinatorRow.completed_at === 'string' ? coordinatorRow.completed_at : null,
            leaseExpiresAt: typeof coordinatorRow.lease_expires_at === 'string' ? coordinatorRow.lease_expires_at : null,
            lastSeenAt: typeof coordinatorRow.last_seen_at === 'string' ? coordinatorRow.last_seen_at : null,
        };
    }
    const legacyRow = (await readLegacyIdempotencyRow(documentSlug, route, idempotencyKey));
    if (!legacyRow)
        return null;
    return {
        state: 'completed',
        response: parseStoredResponse(legacyRow.response_json),
        requestHash: typeof legacyRow.request_hash === 'string' ? legacyRow.request_hash : null,
        statusCode: 200,
        tombstoneRevision: null,
        createdAt: new Date(0).toISOString(),
        completedAt: null,
        leaseExpiresAt: null,
        lastSeenAt: null,
    };

}); }
export async function reservePendingIdempotencyKey(documentSlug: string, route: string, idempotencyKey: string, requestHash: string, leaseExpiresAt: string, reservationToken: string = randomUUID()): Promise<boolean> { return withinDomain(async () => {
await getDb().query('SELECT slug FROM documents WHERE slug = $1 FOR UPDATE', [documentSlug]);

    (await assertWritesAllowed('reservePendingIdempotencyKey'));
    const now = new Date().toISOString();
    const result = (await getDb().prepare(`
    INSERT INTO ${MUTATION_IDEMPOTENCY_TABLE} (
      idempotency_key, document_slug, route, response_json, request_hash, status_code, tombstone_revision, state, completed_at, lease_expires_at, last_seen_at, reservation_token, created_at
    )
    VALUES ($1, $2, $3, $4, $5, 0, NULL, 'pending', NULL, $6, $7, $8, $9)
   ON CONFLICT DO NOTHING`).run(idempotencyKey, documentSlug, route, '{}', requestHash, leaseExpiresAt, now, reservationToken, now));
    return result.changes > 0;

}); }
export async function touchPendingIdempotencyKey(documentSlug: string, route: string, idempotencyKey: string, leaseExpiresAt: string, reservationToken: string | null): Promise<boolean> { return withinDomain(async () => {
await getDb().query('SELECT slug FROM documents WHERE slug = $1 FOR UPDATE', [documentSlug]);

    (await assertWritesAllowed('touchPendingIdempotencyKey'));
    const now = new Date().toISOString();
    const result = (await getDb().prepare(`
    UPDATE ${MUTATION_IDEMPOTENCY_TABLE}
    SET lease_expires_at = $1, last_seen_at = $2
    WHERE idempotency_key = $3 AND document_slug = $4 AND route = $5 AND state = 'pending'
      AND COALESCE(reservation_token, '') = COALESCE($6, '')
  `).run(leaseExpiresAt, now, idempotencyKey, documentSlug, route, reservationToken));
    return result.changes > 0;

}); }
export async function stealExpiredPendingIdempotencyKey(documentSlug: string, route: string, idempotencyKey: string, requestHash: string, expiredBefore: string, nextLeaseExpiresAt: string, reservationToken: string = randomUUID()): Promise<boolean> { return withinDomain(async () => {
await getDb().query('SELECT slug FROM documents WHERE slug = $1 FOR UPDATE', [documentSlug]);

    (await assertWritesAllowed('stealExpiredPendingIdempotencyKey'));
    const now = new Date().toISOString();
    const result = (await getDb().prepare(`
    UPDATE ${MUTATION_IDEMPOTENCY_TABLE}
    SET response_json = '{}',
        request_hash = $1,
        status_code = 0,
        tombstone_revision = NULL,
        state = 'pending',
        completed_at = NULL,
        lease_expires_at = $2,
        last_seen_at = $3,
        reservation_token = $4,
        created_at = $5
    WHERE idempotency_key = $6 AND document_slug = $7 AND route = $8 AND state = 'pending'
      AND lease_expires_at IS NOT NULL AND lease_expires_at <= $9
  `).run(requestHash, nextLeaseExpiresAt, now, reservationToken, now, idempotencyKey, documentSlug, route, expiredBefore));
    return result.changes > 0;

}); }
export async function completePendingIdempotencyKey(documentSlug: string, route: string, idempotencyKey: string, response: Record<string, unknown>, requestHash?: string | null, reservationToken?: string | null, options?: {
    statusCode?: number;
    tombstoneRevision?: number | null;
}): Promise<boolean> { return withinDomain(async () => {
await getDb().query('SELECT slug FROM documents WHERE slug = $1 FOR UPDATE', [documentSlug]);

    (await assertWritesAllowed('completePendingIdempotencyKey'));
    const now = new Date().toISOString();
    const statusCode = Number.isInteger(options?.statusCode) ? Number(options?.statusCode) : 200;
    const tombstoneRevision = options?.tombstoneRevision ?? null;
    const encoded = JSON.stringify(response);
    const d = getDb();
    const tx = async () => await d.transaction(async () => {
        const completed = (await d.prepare(`
      UPDATE ${MUTATION_IDEMPOTENCY_TABLE}
      SET response_json = $1,
          request_hash = COALESCE(request_hash, $2),
          status_code = $3,
          tombstone_revision = $4,
          state = 'completed',
          completed_at = $5,
          lease_expires_at = NULL,
          last_seen_at = $6,
          reservation_token = NULL
      WHERE idempotency_key = $7 AND document_slug = $8 AND route = $9 AND state = 'pending'
        AND COALESCE(reservation_token, '') = COALESCE($10, '')
    `).run(encoded, requestHash ?? null, statusCode, tombstoneRevision, now, now, idempotencyKey, documentSlug, route, reservationToken ?? null)).changes;
        if (completed > 0) {
            (await d.prepare(`
        INSERT INTO idempotency_keys (idempotency_key, document_slug, route, response_json, request_hash, created_at)
        VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (idempotency_key, document_slug, route) DO UPDATE SET response_json = EXCLUDED.response_json, request_hash = EXCLUDED.request_hash, created_at = EXCLUDED.created_at`).run(idempotencyKey, documentSlug, route, encoded, requestHash ?? null, now));
        }
        return completed > 0;
    });
    return (await tx());

}); }
export async function releasePendingIdempotencyKey(documentSlug: string, route: string, idempotencyKey: string, reservationToken?: string | null): Promise<boolean> { return withinDomain(async () => {
await getDb().query('SELECT slug FROM documents WHERE slug = $1 FOR UPDATE', [documentSlug]);

    (await assertWritesAllowed('releasePendingIdempotencyKey'));
    const result = (await getDb().prepare(`
    DELETE FROM ${MUTATION_IDEMPOTENCY_TABLE}
    WHERE idempotency_key = $1 AND document_slug = $2 AND route = $3 AND state = 'pending'
      AND COALESCE(reservation_token, '') = COALESCE($4, '')
  `).run(idempotencyKey, documentSlug, route, reservationToken ?? null));
    return result.changes > 0;

}); }
export async function hasDurableMutationRecordForIdempotencyKey(documentSlug: string, route: string, idempotencyKey: string): Promise<boolean> { return withinDomain(async () => {

    const d = getDb();
    const readMatchedDurableEvidence = async (): Promise<boolean> => {
        const eventRow = (await d.prepare(`
    SELECT 1 AS present
    FROM document_events
    WHERE document_slug = $1 AND idempotency_key = $2 AND mutation_route = $3
    LIMIT 1
  `).get(documentSlug, idempotencyKey, route)) as {
            present?: number;
        } | undefined;
        if (eventRow?.present === 1)
            return true;
        const outboxRow = (await d.prepare(`
    SELECT 1 AS present
    FROM ${MUTATION_OUTBOX_TABLE}
    WHERE document_slug = $1 AND idempotency_key = $2 AND mutation_route = $3
    LIMIT 1
  `).get(documentSlug, idempotencyKey, route)) as {
            present?: number;
        } | undefined;
        return outboxRow?.present === 1;
    };
    if ((await readMatchedDurableEvidence()))
        return true;
    (await backfillLegacyMutationRouteMetadata({ documentSlug, idempotencyKey }));
    return (await readMatchedDurableEvidence());

}); }
export async function storeIdempotencyResult(documentSlug: string, route: string, idempotencyKey: string, response: Record<string, unknown>, requestHash?: string | null, options?: {
    statusCode?: number;
    tombstoneRevision?: number | null;
}): Promise<void> { return withinDomain(async () => {
await getDb().query('SELECT slug FROM documents WHERE slug = $1 FOR UPDATE', [documentSlug]);

    (await assertWritesAllowed('storeIdempotencyResult'));
    const now = new Date().toISOString();
    const statusCode = Number.isInteger(options?.statusCode) ? Number(options?.statusCode) : 200;
    const tombstoneRevision = options?.tombstoneRevision ?? null;
    const encoded = JSON.stringify(response);
    const d = getDb();
    const tx = async () => await d.transaction(async () => {
        (await d.prepare(`
      INSERT INTO idempotency_keys (idempotency_key, document_slug, route, response_json, request_hash, created_at)
      VALUES ($1, $2, $3, $4, $5, $6)
     ON CONFLICT (idempotency_key, document_slug, route) DO UPDATE SET response_json = EXCLUDED.response_json, request_hash = EXCLUDED.request_hash, created_at = EXCLUDED.created_at`).run(idempotencyKey, documentSlug, route, encoded, requestHash ?? null, now));
        (await d.prepare(`
      INSERT INTO ${MUTATION_IDEMPOTENCY_TABLE} (
        idempotency_key, document_slug, route, response_json, request_hash, status_code, tombstone_revision, state, completed_at, lease_expires_at, last_seen_at, reservation_token, created_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, 'completed', $8, NULL, $9, NULL, $10)
     ON CONFLICT (idempotency_key, document_slug, route) DO UPDATE SET response_json = EXCLUDED.response_json, request_hash = EXCLUDED.request_hash, status_code = EXCLUDED.status_code, tombstone_revision = EXCLUDED.tombstone_revision, state = EXCLUDED.state, completed_at = EXCLUDED.completed_at, lease_expires_at = EXCLUDED.lease_expires_at, last_seen_at = EXCLUDED.last_seen_at, reservation_token = EXCLUDED.reservation_token, created_at = EXCLUDED.created_at`).run(idempotencyKey, documentSlug, route, encoded, requestHash ?? null, statusCode, tombstoneRevision, now, now, now));
    });
    (await tx());

}); }
export async function cleanupIdempotencyKeys(maxAgeMs: number = 24 * 60 * 60 * 1000): Promise<number> { return withinDomain(async () => {

    (await assertWritesAllowed('cleanupIdempotencyKeys'));
    const cutoff = new Date(Date.now() - maxAgeMs).toISOString();
    const d = getDb();
    const tx = async () => await d.transaction(async () => {
        const legacy = (await d.prepare(`
      DELETE FROM idempotency_keys
      WHERE created_at < $1
    `).run(cutoff)).changes;
        const coordinator = (await d.prepare(`
      DELETE FROM ${MUTATION_IDEMPOTENCY_TABLE}
      WHERE created_at < $1
    `).run(cutoff)).changes;
        return legacy + coordinator;
    });
    return (await tx());

}); }
export async function cleanupMutationOutbox(maxAgeMs: number = 30 * 24 * 60 * 60 * 1000): Promise<number> { return withinDomain(async () => {

    (await assertWritesAllowed('cleanupMutationOutbox'));
    const cutoff = new Date(Date.now() - maxAgeMs).toISOString();
    const result = (await getDb().prepare(`
    DELETE FROM ${MUTATION_OUTBOX_TABLE}
    WHERE created_at < $1
  `).run(cutoff));
    return result.changes;

}); }
export async function cleanupHttpInfoIncidentEvents(maxAgeMs: number = 60 * 60 * 1000, batchSize: number = 100000): Promise<number> { return withinDomain(async () => {

    (await assertWritesAllowed('cleanupHttpInfoIncidentEvents'));
    const cutoff = new Date(Date.now() - Math.max(0, maxAgeMs)).toISOString();
    const safeBatchSize = Number.isFinite(batchSize) ? Math.max(1, Math.trunc(batchSize)) : 100000;
    const result = (await getDb().prepare(`
    DELETE FROM server_incident_events
    WHERE id IN (
      SELECT id
      FROM server_incident_events
      WHERE subsystem = 'http'
        AND level = 'info'
        AND created_at < $1
      ORDER BY created_at ASC, id ASC
      LIMIT $2
    )
  `).run(cutoff, safeBatchSize));
    return result.changes;

}); }
export async function cleanupExpiredMarkTombstones(nowIso: string = new Date().toISOString()): Promise<number> { return withinDomain(async () => {

    (await assertWritesAllowed('cleanupExpiredMarkTombstones'));
    const result = (await getDb().prepare(`
    DELETE FROM ${MARK_TOMBSTONES_TABLE}
    WHERE expires_at <= $1
  `).run(nowIso));
    return result.changes;

}); }
export async function upsertMarkTombstone(slug: string, markId: string, status: 'accepted' | 'rejected' | 'resolved', resolvedRevision: number): Promise<MarkTombstoneRow> { return withinDomain(async () => {
await getDb().query('SELECT slug FROM documents WHERE slug = $1 FOR UPDATE', [slug]);

    (await assertWritesAllowed('upsertMarkTombstone'));
    const now = new Date().toISOString();
    const ttlDays = parsePositiveInt(process.env.MARK_TOMBSTONE_RETENTION_DAYS, MARK_TOMBSTONE_RETENTION_DAYS);
    const expiresAt = new Date(Date.now() + ttlDays * 24 * 60 * 60 * 1000).toISOString();
    (await getDb().prepare(`
    INSERT INTO ${MARK_TOMBSTONES_TABLE}
      (document_slug, mark_id, status, resolved_revision, created_at, expires_at)
    VALUES ($1, $2, $3, $4, $5, $6)
   ON CONFLICT (document_slug, mark_id) DO UPDATE SET status = EXCLUDED.status, resolved_revision = EXCLUDED.resolved_revision, created_at = EXCLUDED.created_at, expires_at = EXCLUDED.expires_at`).run(slug, markId, status, Math.max(0, Math.trunc(resolvedRevision)), now, expiresAt));
    return (await getDb().prepare(`
    SELECT document_slug, mark_id, status, resolved_revision, created_at, expires_at
    FROM ${MARK_TOMBSTONES_TABLE}
    WHERE document_slug = $1 AND mark_id = $2
    LIMIT 1
  `).get(slug, markId)) as MarkTombstoneRow;

}); }
export async function getMarkTombstone(slug: string, markId: string): Promise<MarkTombstoneRow | null> { return withinDomain(async () => {

    const row = (await getDb().prepare(`
    SELECT document_slug, mark_id, status, resolved_revision, created_at, expires_at
    FROM ${MARK_TOMBSTONES_TABLE}
    WHERE document_slug = $1 AND mark_id = $2
    LIMIT 1
  `).get(slug, markId)) as MarkTombstoneRow | undefined;
    return row ?? null;

}); }
export async function listMarkTombstonesForDocument(slug: string): Promise<MarkTombstoneRow[]> { return withinDomain(async () => {

    return (await getDb().prepare(`
    SELECT document_slug, mark_id, status, resolved_revision, created_at, expires_at
    FROM ${MARK_TOMBSTONES_TABLE}
    WHERE document_slug = $1
    ORDER BY resolved_revision ASC, created_at ASC
  `).all(slug)) as MarkTombstoneRow[];

}); }
export async function shouldRejectMarkMutationByResolvedRevision(slug: string, markId: string, candidateRevision: number | null | undefined): Promise<boolean> { return withinDomain(async () => {

    if (!Number.isFinite(candidateRevision))
        return false;
    const tombstone = (await getMarkTombstone(slug, markId));
    if (!tombstone)
        return false;
    return Math.trunc(candidateRevision as number) <= tombstone.resolved_revision;

}); }
export async function removeResurrectedMarksFromPayload(slug: string, marks: Record<string, unknown>): Promise<{
    marks: Record<string, unknown>;
    removed: string[];
}> { return withinDomain(async () => {

    const markIds = Object.keys(marks);
    if (markIds.length === 0)
        return { marks, removed: [] };
    const placeholders = markIds.map((_, i) => '$' + (i + 2)).join(', ');
    const rows = (await getDb().prepare(`
    SELECT mark_id
    FROM ${MARK_TOMBSTONES_TABLE}
    WHERE document_slug = $1
      AND mark_id IN (${placeholders})
  `).all(slug, ...markIds)) as Array<{
        mark_id: string;
    }>;
    if (rows.length === 0)
        return { marks, removed: [] };
    const tombstoned = new Set(rows.map((row) => row.mark_id));
    const next: Record<string, unknown> = { ...marks };
    const removed: string[] = [];
    for (const markId of tombstoned) {
        const raw = next[markId];
        if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
            delete next[markId];
            removed.push(markId);
            continue;
        }
        const value = raw as Record<string, unknown>;
        const status = typeof value.status === 'string' ? value.status : '';
        const resolved = value.resolved === true;
        const isTerminal = resolved || status === 'accepted' || status === 'rejected';
        if (!isTerminal) {
            delete next[markId];
            removed.push(markId);
        }
    }
    return { marks: next, removed };

}); }
export async function backfillMutationIdempotencyBatch(limit: number = 500): Promise<{
    scanned: number;
    inserted: number;
    checkpoint: number;
    done: boolean;
}> { return withinDomain(async () => {

    (await assertWritesAllowed('backfillMutationIdempotencyBatch'));
    const safeLimit = Math.max(1, Math.min(Math.trunc(limit), 5000));
    const d = getDb();
    const cursor = (await readMetadataNumber(d, MUTATION_IDEMPOTENCY_BACKFILL_CURSOR_KEY, 0));
    const rows = (await d.prepare(`
    SELECT rowid, idempotency_key, document_slug, route, response_json, request_hash, created_at
    FROM idempotency_keys
    WHERE rowid > $1
    ORDER BY rowid ASC
    LIMIT $2
  `).all(cursor, safeLimit)) as Array<{
        rowid: number;
        idempotency_key: string;
        document_slug: string;
        route: string;
        response_json: string;
        request_hash: string | null;
        created_at: string;
    }>;
    let inserted = 0;
    let checkpoint = cursor;
    const insertStmt = d.prepare(`
    INSERT INTO ${MUTATION_IDEMPOTENCY_TABLE}
      (
        idempotency_key, document_slug, route, response_json, request_hash, status_code, tombstone_revision,
        state, completed_at, lease_expires_at, last_seen_at, reservation_token, created_at
      )
    VALUES ($1, $2, $3, $4, $5, 200, NULL, 'completed', $6, NULL, $7, NULL, $8)
   ON CONFLICT DO NOTHING`);
    const tx = async () => await d.transaction(async () => {
        for (const row of rows) {
            checkpoint = row.rowid;
            inserted += (await insertStmt.run(row.idempotency_key, row.document_slug, row.route, row.response_json, row.request_hash, row.created_at, row.created_at, row.created_at)).changes;
        }
        if (rows.length > 0) {
            (await writeMetadataNumber(d, MUTATION_IDEMPOTENCY_BACKFILL_CURSOR_KEY, checkpoint));
        }
    });
    (await tx());
    if (inserted > 0) {
        recordMutationBackfill('mutation_idempotency', 'inserted', inserted);
    }
    if (rows.length - inserted > 0) {
        recordMutationBackfill('mutation_idempotency', 'skipped', rows.length - inserted);
    }
    return {
        scanned: rows.length,
        inserted,
        checkpoint,
        done: rows.length < safeLimit,
    };

}); }
export async function backfillMutationOutboxBatch(limit: number = 500): Promise<{
    scanned: number;
    inserted: number;
    checkpoint: number;
    done: boolean;
}> { return withinDomain(async () => {

    (await assertWritesAllowed('backfillMutationOutboxBatch'));
    const safeLimit = Math.max(1, Math.min(Math.trunc(limit), 5000));
    const d = getDb();
    const cursor = (await readMetadataNumber(d, MUTATION_OUTBOX_BACKFILL_CURSOR_KEY, 0));
    const rows = (await d.prepare(`
    SELECT id, document_slug, document_revision, event_type, event_data, actor, idempotency_key, tombstone_revision, created_at
         , mutation_route
    FROM document_events
    WHERE id > $1
    ORDER BY id ASC
    LIMIT $2
  `).all(cursor, safeLimit)) as Array<{
        id: number;
        document_slug: string;
        document_revision: number | null;
        event_type: string;
        event_data: string;
        actor: string;
        idempotency_key: string | null;
        mutation_route: string | null;
        tombstone_revision: number | null;
        created_at: string;
    }>;
    let inserted = 0;
    let checkpoint = cursor;
    const insertStmt = d.prepare(`
    INSERT INTO ${MUTATION_OUTBOX_TABLE}
      (document_slug, document_revision, event_id, event_type, event_data, actor, idempotency_key, mutation_route, tombstone_revision, created_at, delivered_at)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NULL)
   ON CONFLICT DO NOTHING RETURNING id`);
    const tx = async () => await d.transaction(async () => {
        for (const row of rows) {
            checkpoint = row.id;
            inserted += (await insertStmt.run(row.document_slug, row.document_revision ?? null, row.id, row.event_type, row.event_data, row.actor, row.idempotency_key ?? null, row.mutation_route ?? null, row.tombstone_revision ?? null, row.created_at)).changes;
        }
        if (rows.length > 0) {
            (await writeMetadataNumber(d, MUTATION_OUTBOX_BACKFILL_CURSOR_KEY, checkpoint));
        }
    });
    (await tx());
    if (inserted > 0) {
        recordMutationBackfill('mutation_outbox', 'inserted', inserted);
    }
    if (rows.length - inserted > 0) {
        recordMutationBackfill('mutation_outbox', 'skipped', rows.length - inserted);
    }
    return {
        scanned: rows.length,
        inserted,
        checkpoint,
        done: rows.length < safeLimit,
    };

}); }
export async function appendYUpdate(documentSlug: string, update: Uint8Array, sourceActor?: string): Promise<number> { return withinDomain(async () => {
await getDb().query('SELECT slug FROM documents WHERE slug = $1 FOR UPDATE', [documentSlug]);

    (await assertWritesAllowed('appendYUpdate'));
    assertYjsUpdateWithinLimit(documentSlug, update, sourceActor ?? null);
    const now = new Date().toISOString();
    const result = (await getDb().prepare(`
    INSERT INTO document_y_updates (document_slug, update_blob, source_actor, created_at)
    VALUES ($1, $2, $3, $4)
   RETURNING seq`).run(documentSlug, Buffer.from(update), sourceActor ?? null, now));
    return Number(result.insertedId);

}); }
export async function getYUpdatesAfter(documentSlug: string, afterSeq: number): Promise<Array<{
    seq: number;
    update: Uint8Array;
}>> { return withinDomain(async () => {

    const rows = (await getDb().prepare(`
    SELECT seq, update_blob
    FROM document_y_updates
    WHERE document_slug = $1 AND seq > $2
    ORDER BY seq ASC
  `).all(documentSlug, afterSeq)) as Array<{
        seq: number;
        update_blob: Buffer;
    }>;
    return rows.map((row) => ({ seq: row.seq, update: new Uint8Array(row.update_blob) }));

}); }
export async function getYUpdatesAtOrAfter(documentSlug: string, fromSeq: number): Promise<Array<{
    seq: number;
    update: Uint8Array;
}>> { return withinDomain(async () => {

    const rows = (await getDb().prepare(`
    SELECT seq, update_blob
    FROM document_y_updates
    WHERE document_slug = $1 AND seq >= $2
    ORDER BY seq ASC
  `).all(documentSlug, fromSeq)) as Array<{
        seq: number;
        update_blob: Buffer;
    }>;
    return rows.map((row) => ({ seq: row.seq, update: new Uint8Array(row.update_blob) }));

}); }
export async function getAccumulatedYUpdateBytesAfter(documentSlug: string, afterSeq: number): Promise<number> { return withinDomain(async () => {

    const row = (await getDb().prepare(`
    SELECT COALESCE(SUM(OCTET_LENGTH(update_blob)), 0) AS total_bytes
    FROM document_y_updates
    WHERE document_slug = $1 AND seq > $2
  `).get(documentSlug, afterSeq)) as {
        total_bytes?: number;
    } | undefined;
    const totalBytes = Number(row?.total_bytes ?? 0);
    return Number.isFinite(totalBytes) && totalBytes > 0 ? totalBytes : 0;

}); }
export async function getYUpdatesInRange(documentSlug: string, afterSeqExclusive: number, upToSeqInclusive: number): Promise<DocumentYUpdateRow[]> { return withinDomain(async () => {

    const rows = (await getDb().prepare(`
    SELECT seq, update_blob, source_actor, created_at
    FROM document_y_updates
    WHERE document_slug = $1 AND seq > $2 AND seq <= $3
    ORDER BY seq ASC
  `).all(documentSlug, afterSeqExclusive, upToSeqInclusive)) as Array<{
        seq: number;
        update_blob: Buffer;
        source_actor: string | null;
        created_at: string;
    }>;
    return rows.map((row) => ({
        seq: row.seq,
        update: new Uint8Array(row.update_blob),
        source_actor: row.source_actor ?? null,
        created_at: row.created_at,
    }));

}); }
export async function getYUpdateMetaPage(documentSlug: string, beforeSeqExclusive: number | null, limit: number): Promise<DocumentYUpdateMetaRow[]> { return withinDomain(async () => {

    const safeLimit = Math.max(1, Math.min(limit, 500));
    if (typeof beforeSeqExclusive === 'number' && Number.isFinite(beforeSeqExclusive)) {
        return (await getDb().prepare(`
      SELECT seq, source_actor, created_at
      FROM document_y_updates
      WHERE document_slug = $1 AND seq < $2
      ORDER BY seq DESC
      LIMIT $3
    `).all(documentSlug, beforeSeqExclusive, safeLimit)) as DocumentYUpdateMetaRow[];
    }
    return (await getDb().prepare(`
    SELECT seq, source_actor, created_at
    FROM document_y_updates
    WHERE document_slug = $1
    ORDER BY seq DESC
    LIMIT $2
  `).all(documentSlug, safeLimit)) as DocumentYUpdateMetaRow[];

}); }
export async function getLatestYUpdate(documentSlug: string): Promise<DocumentYUpdateRow | null> { return withinDomain(async () => {

    const row = (await getDb().prepare(`
    SELECT seq, update_blob, source_actor, created_at
    FROM document_y_updates
    WHERE document_slug = $1
    ORDER BY seq DESC
    LIMIT 1
  `).get(documentSlug)) as {
        seq?: number;
        update_blob?: Buffer;
        source_actor?: string | null;
        created_at?: string;
    } | undefined;
    if (!row?.update_blob || row.seq === undefined || typeof row.created_at !== 'string')
        return null;
    return {
        seq: row.seq,
        update: new Uint8Array(row.update_blob),
        source_actor: row.source_actor ?? null,
        created_at: row.created_at,
    };

}); }
export async function getLatestYStateVersion(documentSlug: string): Promise<number> { return withinDomain(async () => {

    const row = (await getDb().prepare(`
    SELECT
      COALESCE((SELECT MAX(seq) FROM document_y_updates WHERE document_slug = $1), 0) AS max_update_seq,
      COALESCE((SELECT MAX(version) FROM document_y_snapshots WHERE document_slug = $2), 0) AS max_snapshot_version
  `).get(documentSlug, documentSlug)) as {
        max_update_seq?: number;
        max_snapshot_version?: number;
    } | undefined;
    const maxUpdateSeq = Number(row?.max_update_seq ?? 0);
    const maxSnapshotVersion = Number(row?.max_snapshot_version ?? 0);
    return Math.max(Number.isFinite(maxUpdateSeq) ? maxUpdateSeq : 0, Number.isFinite(maxSnapshotVersion) ? maxSnapshotVersion : 0);

}); }
export async function updateYStateBlob(slug: string, blob: Uint8Array): Promise<void> { return withinDomain(async () => {
await getDb().query('SELECT slug FROM documents WHERE slug = $1 FOR UPDATE', [slug]);

    (await assertWritesAllowed('updateYStateBlob'));
    (await getDb().prepare('UPDATE documents SET y_state_blob = $1 WHERE slug = $2 AND share_state IN (\'ACTIVE\', \'PAUSED\')').run(Buffer.from(blob), slug));

}); }
export async function getYStateBlob(slug: string): Promise<Uint8Array | null> { return withinDomain(async () => {

    const row = (await getDb().prepare('SELECT y_state_blob FROM documents WHERE slug = $1').get(slug)) as {
        y_state_blob: Buffer | null;
    } | undefined;
    if (!row?.y_state_blob)
        return null;
    return new Uint8Array(row.y_state_blob);

}); }
export async function saveYSnapshot(documentSlug: string, version: number, snapshot: Uint8Array): Promise<void> { return withinDomain(async () => {
await getDb().query('SELECT slug FROM documents WHERE slug = $1 FOR UPDATE', [documentSlug]);

    (await assertWritesAllowed('saveYSnapshot'));
    const now = new Date().toISOString();
    (await getDb().prepare(`
    INSERT INTO document_y_snapshots (document_slug, version, snapshot_blob, created_at)
    VALUES ($1, $2, $3, $4)
   ON CONFLICT (document_slug, version) DO UPDATE SET snapshot_blob = EXCLUDED.snapshot_blob, created_at = EXCLUDED.created_at`).run(documentSlug, version, Buffer.from(snapshot), now));

}); }
export async function pruneObsoleteYHistory(documentSlug: string, latestSnapshotVersion?: number | null): Promise<{
    deletedUpdates: number;
    deletedSnapshots: number;
    snapshotVersion: number;
}> { return withinDomain(async () => {
await getDb().query('SELECT slug FROM documents WHERE slug = $1 FOR UPDATE', [documentSlug]);

    (await assertWritesAllowed('pruneObsoleteYHistory'));
    const snapshotVersion = typeof latestSnapshotVersion === 'number' && Number.isFinite(latestSnapshotVersion)
        ? Math.max(0, Math.trunc(latestSnapshotVersion))
        : ((await getLatestYSnapshot(documentSlug))?.version ?? 0);
    if (snapshotVersion <= 0) {
        return {
            deletedUpdates: 0,
            deletedSnapshots: 0,
            snapshotVersion: 0,
        };
    }
    const d = getDb();
    const deletedUpdates = (await d.prepare(`
    DELETE FROM document_y_updates
    WHERE document_slug = $1 AND seq < $2
  `).run(documentSlug, snapshotVersion)).changes;
    const deletedSnapshots = (await d.prepare(`
    DELETE FROM document_y_snapshots
    WHERE document_slug = $1 AND version < $2
  `).run(documentSlug, snapshotVersion)).changes;
    return {
        deletedUpdates,
        deletedSnapshots,
        snapshotVersion,
    };

}); }
export async function getLatestYSnapshot(documentSlug: string): Promise<{
    version: number;
    snapshot: Uint8Array;
} | null> { return withinDomain(async () => {

    const row = (await getDb().prepare(`
    SELECT version, snapshot_blob
    FROM document_y_snapshots
    WHERE document_slug = $1
    ORDER BY version DESC
    LIMIT 1
  `).get(documentSlug)) as {
        version?: number;
        snapshot_blob?: Buffer;
    } | undefined;
    if (!row?.snapshot_blob || row.version === undefined)
        return null;
    return {
        version: row.version,
        snapshot: new Uint8Array(row.snapshot_blob),
    };

}); }
export async function getLatestYSnapshotAtOrBefore(documentSlug: string, seq: number): Promise<DocumentYSnapshotRow | null> { return withinDomain(async () => {

    const row = (await getDb().prepare(`
    SELECT version, snapshot_blob, created_at
    FROM document_y_snapshots
    WHERE document_slug = $1 AND version <= $2
    ORDER BY version DESC
    LIMIT 1
  `).get(documentSlug, seq)) as {
        version?: number;
        snapshot_blob?: Buffer;
        created_at?: string;
    } | undefined;
    if (!row?.snapshot_blob || row.version === undefined || typeof row.created_at !== 'string')
        return null;
    return {
        version: row.version,
        snapshot: new Uint8Array(row.snapshot_blob),
        created_at: row.created_at,
    };

}); }
export async function getSnapshotVersionsForSeqs(documentSlug: string, seqs: number[]): Promise<Set<number>> { return withinDomain(async () => {

    const uniqueSeqs = Array.from(new Set(seqs.filter((value) => Number.isFinite(value) && value > 0)));
    if (uniqueSeqs.length === 0)
        return new Set<number>();
    const placeholders = uniqueSeqs.map((_, i) => '$' + (i + 2)).join(', ');
    const rows = (await getDb().prepare(`
    SELECT version
    FROM document_y_snapshots
    WHERE document_slug = $1 AND version IN (${placeholders})
  `).all(documentSlug, ...uniqueSeqs)) as Array<{
        version: number;
    }>;
    return new Set(rows.map((row) => row.version));

}); }
export async function listDocumentEventsInTimeRange(slug: string, fromIsoInclusive: string, toIsoInclusive: string): Promise<DocumentEventRow[]> { return withinDomain(async () => {

    return (await getDb().prepare(`
    SELECT *
    FROM document_events
    WHERE document_slug = $1 AND created_at >= $2 AND created_at <= $3
    ORDER BY created_at ASC, id ASC
  `).all(slug, fromIsoInclusive, toIsoInclusive)) as DocumentEventRow[];

}); }
function stringifyServerIncidentData(data: Record<string, unknown> | null | undefined): string {
    try {
        return JSON.stringify(data ?? {});
    }
    catch {
        return JSON.stringify({ serializationError: true });
    }
}
export async function recordServerIncidentEvent(input: ServerIncidentEventInput): Promise<number> { return withinDomain(async () => {

    (await assertWritesAllowed('server_incident_events.insert'));
    const createdAt = typeof input.timestamp === 'string' && input.timestamp.trim()
        ? input.timestamp.trim()
        : new Date().toISOString();
    const result = (await getDb().prepare(`
    INSERT INTO server_incident_events (
      request_id,
      slug,
      subsystem,
      level,
      event_type,
      message,
      data_json,
      created_at
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
   RETURNING id`).run(input.requestId?.trim() || null, input.slug?.trim() || null, input.subsystem, input.level, input.eventType, input.message, stringifyServerIncidentData(input.data), createdAt));
    return Number(result.insertedId);

}); }
export async function listServerIncidentEventsByRequestId(requestId: string, limit: number = 250): Promise<ServerIncidentEventRow[]> { return withinDomain(async () => {

    const normalized = requestId.trim();
    if (!normalized)
        return [];
    const safeLimit = Math.max(1, Math.min(limit, 1000));
    return (await getDb().prepare(`
    SELECT *
    FROM server_incident_events
    WHERE request_id = $1
    ORDER BY created_at ASC, id ASC
    LIMIT $2
  `).all(normalized, safeLimit)) as ServerIncidentEventRow[];

}); }
export async function listServerIncidentEventsInTimeRange(slug: string, fromIsoInclusive: string, toIsoInclusive: string, limit: number = 250): Promise<ServerIncidentEventRow[]> { return withinDomain(async () => {

    const safeLimit = Math.max(1, Math.min(limit, 1000));
    return (await getDb().prepare(`
    SELECT *
    FROM server_incident_events
    WHERE slug = $1 AND created_at >= $2 AND created_at <= $3
    ORDER BY created_at ASC, id ASC
    LIMIT $4
  `).all(slug, fromIsoInclusive, toIsoInclusive, safeLimit)) as ServerIncidentEventRow[];

}); }
export type DocumentBaselineCandidate = {
    slug: string;
    markdown: string;
    marks: string;
};
export type StaleProjectionCandidate = {
    slug: string;
    y_state_version: number;
    latest_y_state_version: number;
    projection_health: DocumentProjectionRow['health'];
    updated_at: string;
};
export type SuspiciousProjectionCandidate = {
    slug: string;
    updated_at: string;
    markdown_chars: number;
    y_state_version: number;
    latest_y_state_version: number;
    projection_health: DocumentProjectionRow['health'];
};
export async function listDocumentsMissingYjsState(limit: number = 500): Promise<DocumentBaselineCandidate[]> { return withinDomain(async () => {

    const safeLimit = Math.max(1, Math.min(limit, 10000));
    return (await getDb().prepare(`
    SELECT d.slug, d.markdown, d.marks
    FROM documents d
    WHERE d.share_state != 'DELETED'
      AND NOT EXISTS (
        SELECT 1 FROM document_y_updates u
        WHERE u.document_slug = d.slug
      )
      AND NOT EXISTS (
        SELECT 1 FROM document_y_snapshots s
        WHERE s.document_slug = d.slug
      )
    ORDER BY d.created_at ASC
    LIMIT $1
  `).all(safeLimit)) as DocumentBaselineCandidate[];

}); }
export async function listDocsWithStaleProjection(limit: number = 100): Promise<StaleProjectionCandidate[]> { return withinDomain(async () => {

    const safeLimit = Math.max(1, Math.min(limit, 1000));
    return (await getDb().prepare(`
    WITH latest AS (
      SELECT
        d.slug AS slug,
        d.updated_at AS updated_at,
        (
          SELECT MAX(value)
          FROM (
            SELECT COALESCE(MAX(u.seq), 0) AS value
            FROM document_y_updates u
            WHERE u.document_slug = d.slug
            UNION ALL
            SELECT COALESCE(MAX(s.version), 0) AS value
            FROM document_y_snapshots s
            WHERE s.document_slug = d.slug
          ) AS history_versions
        ) AS latest_y_state_version
      FROM documents d
      WHERE d.share_state IN ('ACTIVE', 'PAUSED')
    )
    SELECT
      latest.slug,
      COALESCE(p.y_state_version, 0) AS y_state_version,
      latest.latest_y_state_version,
      COALESCE(p.health, 'projection_stale') AS projection_health,
      latest.updated_at
    FROM latest
    LEFT JOIN document_projections p
      ON p.document_slug = latest.slug
    WHERE latest.latest_y_state_version > COALESCE(p.y_state_version, 0)
       OR COALESCE(p.health, 'projection_stale') != 'healthy'
    ORDER BY latest.updated_at DESC
    LIMIT $1
  `).all(safeLimit)) as StaleProjectionCandidate[];

}); }
export async function listSuspiciousProjectionCandidates(limit: number = 100, minMarkdownChars: number = 1000000): Promise<SuspiciousProjectionCandidate[]> { return withinDomain(async () => {

    const safeLimit = Math.max(1, Math.min(limit, 1000));
    const safeMinChars = Math.max(1000, Math.min(Math.trunc(minMarkdownChars), 100000000));
    return (await getDb().prepare(`
    WITH latest AS (
      SELECT
        d.slug AS slug,
        d.updated_at AS updated_at,
        (
          SELECT MAX(value)
          FROM (
            SELECT COALESCE(MAX(u.seq), 0) AS value
            FROM document_y_updates u
            WHERE u.document_slug = d.slug
            UNION ALL
            SELECT COALESCE(MAX(s.version), 0) AS value
            FROM document_y_snapshots s
            WHERE s.document_slug = d.slug
          ) AS history_versions
        ) AS latest_y_state_version
      FROM documents d
      WHERE d.share_state IN ('ACTIVE', 'PAUSED')
    )
    SELECT
      latest.slug,
      latest.updated_at,
      LENGTH(COALESCE(p.markdown, d.markdown)) AS markdown_chars,
      COALESCE(p.y_state_version, 0) AS y_state_version,
      latest.latest_y_state_version,
      COALESCE(p.health, 'projection_stale') AS projection_health
    FROM latest
    JOIN documents d
      ON d.slug = latest.slug
    LEFT JOIN document_projections p
      ON p.document_slug = latest.slug
    WHERE LENGTH(COALESCE(p.markdown, d.markdown)) >= $1
       OR latest.latest_y_state_version > COALESCE(p.y_state_version, 0)
       OR COALESCE(p.health, 'projection_stale') != 'healthy'
    ORDER BY markdown_chars DESC, latest.updated_at DESC
    LIMIT $2
  `).all(safeMinChars, safeLimit)) as SuspiciousProjectionCandidate[];

}); }
export async function clearYjsState(documentSlug: string): Promise<{
    clearedUpdates: number;
    clearedSnapshots: number;
}> { return withinDomain(async () => {
await getDb().query('SELECT slug FROM documents WHERE slug = $1 FOR UPDATE', [documentSlug]);

    (await assertWritesAllowed('clearYjsState'));
    const d = getDb();
    const tx = async () => await d.transaction(async () => {
        const clearedUpdates = (await d.prepare(`
      DELETE FROM document_y_updates
      WHERE document_slug = $1
    `).run(documentSlug)).changes;
        const clearedSnapshots = (await d.prepare(`
      DELETE FROM document_y_snapshots
      WHERE document_slug = $1
    `).run(documentSlug)).changes;
        (await d.prepare(`
      UPDATE documents
      SET y_state_version = 0
      WHERE slug = $1
    `).run(documentSlug));
        return { clearedUpdates, clearedSnapshots };
    });
    return (await tx());

}); }
export async function hasMaintenanceRun(runKey: string): Promise<boolean> { return withinDomain(async () => {

    const row = (await getDb()
        .prepare('SELECT run_key FROM maintenance_runs WHERE run_key = $1')
        .get(runKey)) as {
        run_key?: string;
    } | undefined;
    return Boolean(row?.run_key);

}); }
export async function recordMaintenanceRun(runKey: string, summary?: unknown): Promise<void> { return withinDomain(async () => {

    (await assertWritesAllowed('recordMaintenanceRun'));
    const now = new Date().toISOString();
    const encodedSummary = summary === undefined ? null : JSON.stringify(summary);
    (await getDb()
        .prepare(`
      INSERT INTO maintenance_runs (run_key, completed_at, summary)
      VALUES ($1, $2, $3)
     ON CONFLICT (run_key) DO UPDATE SET completed_at = EXCLUDED.completed_at, summary = EXCLUDED.summary`)
        .run(runKey, now, encodedSummary));

}); }
export async function createShareAuthSession(input: {
    sessionToken: string;
    provider?: string;
    everyUserId: number;
    email: string;
    name?: string | null;
    subscriber?: boolean;
    accessToken: string;
    refreshToken?: string | null;
    accessExpiresAt: string;
    sessionExpiresAt: string;
}): Promise<ShareAuthSessionRow> { return withinDomain(async () => {

    (await assertWritesAllowed('createShareAuthSession'));
    const now = new Date().toISOString();
    const provider = input.provider ?? 'every';
    const hash = hashSecret(input.sessionToken);
    (await getDb().prepare(`
    INSERT INTO share_auth_sessions (
      session_token_hash, provider, every_user_id, email, name, subscriber,
      access_token, refresh_token, access_expires_at, session_expires_at,
      last_verified_at, revoked_at, created_at, updated_at
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NULL, $12, $13)
   ON CONFLICT (session_token_hash) DO UPDATE SET provider = EXCLUDED.provider, every_user_id = EXCLUDED.every_user_id, email = EXCLUDED.email, name = EXCLUDED.name, subscriber = EXCLUDED.subscriber, access_token = EXCLUDED.access_token, refresh_token = EXCLUDED.refresh_token, access_expires_at = EXCLUDED.access_expires_at, session_expires_at = EXCLUDED.session_expires_at, last_verified_at = EXCLUDED.last_verified_at, revoked_at = EXCLUDED.revoked_at, created_at = EXCLUDED.created_at, updated_at = EXCLUDED.updated_at`).run(hash, provider, input.everyUserId, input.email, input.name ?? null, input.subscriber === false ? 0 : 1, input.accessToken, input.refreshToken ?? null, input.accessExpiresAt, input.sessionExpiresAt, now, now, now));
    return (await getDb().prepare(`
    SELECT *
    FROM share_auth_sessions
    WHERE session_token_hash = $1
    LIMIT 1
  `).get(hash)) as ShareAuthSessionRow;

}); }
export async function getShareAuthSession(sessionToken: string): Promise<ShareAuthSessionRow | null> { return withinDomain(async () => {

    if (!sessionToken)
        return null;
    const hash = hashSecret(sessionToken);
    const row = (await getDb().prepare(`
    SELECT *
    FROM share_auth_sessions
    WHERE session_token_hash = $1
    LIMIT 1
  `).get(hash)) as ShareAuthSessionRow | undefined;
    return row ?? null;

}); }
export async function updateShareAuthSessionTokens(input: {
    sessionToken: string;
    accessToken: string;
    refreshToken?: string | null;
    accessExpiresAt: string;
}): Promise<boolean> { return withinDomain(async () => {

    (await assertWritesAllowed('updateShareAuthSessionTokens'));
    const now = new Date().toISOString();
    const hash = hashSecret(input.sessionToken);
    const result = (await getDb().prepare(`
    UPDATE share_auth_sessions
    SET access_token = $1, refresh_token = $2, access_expires_at = $3, updated_at = $4, revoked_at = NULL
    WHERE session_token_hash = $5
  `).run(input.accessToken, input.refreshToken ?? null, input.accessExpiresAt, now, hash));
    return result.changes > 0;

}); }
export async function touchShareAuthSessionVerification(input: {
    sessionToken: string;
    email?: string | null;
    name?: string | null;
    subscriber?: boolean;
    sessionExpiresAt?: string;
}): Promise<boolean> { return withinDomain(async () => {

    (await assertWritesAllowed('touchShareAuthSessionVerification'));
    const now = new Date().toISOString();
    const hash = hashSecret(input.sessionToken);
    const subscriberValue = input.subscriber === undefined ? null : (input.subscriber ? 1 : 0);
    const result = subscriberValue === null
        ? (await getDb().prepare(`
      UPDATE share_auth_sessions
      SET
        email = COALESCE($1, email),
        name = COALESCE($2, name),
        session_expires_at = COALESCE($3, session_expires_at),
        last_verified_at = $4,
        updated_at = $5
      WHERE session_token_hash = $6
    `).run(input.email ?? null, input.name ?? null, input.sessionExpiresAt ?? null, now, now, hash)) : (await getDb().prepare(`
      UPDATE share_auth_sessions
      SET
        email = COALESCE($1, email),
        name = COALESCE($2, name),
        subscriber = $3,
        session_expires_at = COALESCE($4, session_expires_at),
        last_verified_at = $5,
        updated_at = $6,
        revoked_at = NULL
      WHERE session_token_hash = $7
    `).run(input.email ?? null, input.name ?? null, subscriberValue, input.sessionExpiresAt ?? null, now, now, hash));
    return result.changes > 0;

}); }
export async function revokeShareAuthSession(sessionToken: string): Promise<boolean> { return withinDomain(async () => {

    (await assertWritesAllowed('revokeShareAuthSession'));
    const now = new Date().toISOString();
    const hash = hashSecret(sessionToken);
    const result = (await getDb().prepare(`
    UPDATE share_auth_sessions
    SET revoked_at = $1, updated_at = $2
    WHERE session_token_hash = $3
  `).run(now, now, hash));
    return result.changes > 0;

}); }
export async function upsertUserDocumentVisit(everyUserId: number, slug: string, role?: string): Promise<void> { return withinDomain(async () => {

    (await assertWritesAllowed('upsertUserDocumentVisit'));
    const now = new Date().toISOString();
    (await getDb().prepare(`
    INSERT INTO user_document_visits (every_user_id, document_slug, role, first_visited_at, last_visited_at)
    VALUES ($1, $2, $3, $4, $5)
    ON CONFLICT (every_user_id, document_slug) DO UPDATE SET
      last_visited_at = excluded.last_visited_at,
      role = COALESCE(excluded.role, user_document_visits.role)
  `).run(everyUserId, slug, role ?? null, now, now));

}); }
export async function getLibraryDocumentSlug(everyUserId: number): Promise<string | null> { return withinDomain(async () => {

    const row = (await getDb()
        .prepare('SELECT document_slug FROM library_documents WHERE every_user_id = $1 LIMIT 1')
        .get(everyUserId)) as {
        document_slug: string;
    } | undefined;
    return row?.document_slug ?? null;

}); }
export async function upsertLibraryDocument(everyUserId: number, slug: string): Promise<void> { return withinDomain(async () => {

    (await assertWritesAllowed('upsertLibraryDocument'));
    const now = new Date().toISOString();
    (await getDb().prepare(`
    INSERT INTO library_documents (every_user_id, document_slug, created_at, updated_at)
    VALUES ($1, $2, $3, $4)
    ON CONFLICT (every_user_id) DO UPDATE SET
      document_slug = excluded.document_slug,
      updated_at = excluded.updated_at
  `).run(everyUserId, slug, now, now));

}); }
export async function listDocumentVisitUserIds(slug: string, limit: number = 200): Promise<number[]> { return withinDomain(async () => {

    const rows = (await getDb().prepare(`
    SELECT every_user_id
    FROM user_document_visits
    WHERE document_slug = $1
    ORDER BY last_visited_at DESC
    LIMIT $2
  `).all(slug, limit)) as Array<{
        every_user_id: number;
    }>;
    return rows.map((row) => row.every_user_id);

}); }
export interface DashboardDocumentRow {
    slug: string;
    title: string | null;
    share_state: string;
    updated_at: string;
    created_at: string;
    last_visited_at?: string;
    is_owned?: number;
    copy_url?: string;
}
export async function listUserOwnedDocuments(everyUserId: number, limit: number = 50): Promise<DashboardDocumentRow[]> { return withinDomain(async () => {

    const asStr = String(everyUserId);
    return (await getDb().prepare(`
    SELECT slug, title, share_state, updated_at, created_at
    FROM documents
    WHERE (owner_id = $1 OR owner_id = $2 OR owner_id = $3)
      AND deleted_at IS NULL
    ORDER BY updated_at DESC
    LIMIT $4
  `).all(asStr, `every:${asStr}`, `every_user:${asStr}`, limit)) as DashboardDocumentRow[];

}); }
export async function listSharedWithMeDocuments(everyUserId: number, limit: number = 50): Promise<DashboardDocumentRow[]> { return withinDomain(async () => {

    const asStr = String(everyUserId);
    return (await getDb().prepare(`
    SELECT d.slug, d.title, d.share_state, d.updated_at, d.created_at, v.last_visited_at
    FROM user_document_visits v
    JOIN documents d ON d.slug = v.document_slug
    WHERE v.every_user_id = $1
      AND d.deleted_at IS NULL
      AND d.share_state != 'DELETED'
      AND (d.owner_id IS NULL OR (d.owner_id != $2 AND d.owner_id != $3 AND d.owner_id != $4))
    ORDER BY v.last_visited_at DESC
    LIMIT $5
  `).all(everyUserId, asStr, `every:${asStr}`, `every_user:${asStr}`, limit)) as DashboardDocumentRow[];

}); }
export async function listRecentlyOpenedDocuments(everyUserId: number, limit: number = 50): Promise<DashboardDocumentRow[]> { return withinDomain(async () => {

    const asStr = String(everyUserId);
    return (await getDb().prepare(`
    SELECT d.slug, d.title, d.share_state, d.updated_at, d.created_at, v.last_visited_at,
      CASE
        WHEN (d.owner_id = $1 OR d.owner_id = $2 OR d.owner_id = $3) THEN 1
        ELSE 0
      END AS is_owned
    FROM user_document_visits v
    JOIN documents d ON d.slug = v.document_slug
    WHERE v.every_user_id = $4
      AND d.deleted_at IS NULL
      AND d.share_state != 'DELETED'
    ORDER BY v.last_visited_at DESC
    LIMIT $5
  `).all(asStr, `every:${asStr}`, `every_user:${asStr}`, everyUserId, limit)) as DashboardDocumentRow[];

}); }
export async function listDashboardDocuments(everyUserId: number, limit: number = 100): Promise<DashboardDocumentRow[]> { return withinDomain(async () => {

    const asStr = String(everyUserId);
    return (await getDb().prepare(`
    SELECT slug, title, share_state, updated_at, created_at, last_visited_at, is_owned
    FROM (
      SELECT
        d.slug,
        d.title,
        d.share_state,
        d.updated_at,
        d.created_at,
        NULL AS last_visited_at,
        1 AS is_owned,
        d.updated_at AS sort_at
      FROM documents d
      WHERE (d.owner_id = $1 OR d.owner_id = $2 OR d.owner_id = $3)
        AND d.deleted_at IS NULL

      UNION ALL

      SELECT
        d.slug,
        d.title,
        d.share_state,
        d.updated_at,
        d.created_at,
        v.last_visited_at AS last_visited_at,
        0 AS is_owned,
        COALESCE(v.last_visited_at, d.updated_at) AS sort_at
      FROM user_document_visits v
      JOIN documents d ON d.slug = v.document_slug
      WHERE v.every_user_id = $4
        AND d.deleted_at IS NULL
        AND d.share_state = 'ACTIVE'
        AND (d.owner_id IS NULL OR (d.owner_id != $5 AND d.owner_id != $6 AND d.owner_id != $7))
    )
    ORDER BY sort_at DESC
    LIMIT $8
  `).all(asStr, `every:${asStr}`, `every_user:${asStr}`, everyUserId, asStr, `every:${asStr}`, `every_user:${asStr}`, limit)) as DashboardDocumentRow[];

}); }
export async function updateDocumentOwnerId(slug: string, ownerId: string): Promise<boolean> { return withinDomain(async () => {
await getDb().query('SELECT slug FROM documents WHERE slug = $1 FOR UPDATE', [slug]);

    (await assertWritesAllowed('updateDocumentOwnerId'));
    const now = new Date().toISOString();
    const result = (await getDb().prepare(`
    UPDATE documents
    SET owner_id = $1, updated_at = $2
    WHERE slug = $3 AND (owner_id IS NULL OR owner_id = '')
  `).run(ownerId, now, slug));
    return result.changes > 0;

}); }
