import { randomUUID } from 'node:crypto';
import { getMutationIdempotencyRecord, reservePendingIdempotencyKey, completePendingIdempotencyKey, releasePendingIdempotencyKey, hasDurableMutationRecordForIdempotencyKey } from './db-postgres.js';
import { traceServerIncident } from './incident-tracing.js';

const DEFAULT_PENDING_LEASE_MS = parsePositiveInt(process.env.PROOF_IDEMPOTENCY_PENDING_LEASE_MS, 30_000);

function parsePositiveInt(value: string | undefined, fallback: number): number {
  const parsed = value ? Number.parseInt(value, 10) : Number.NaN;
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

export type MutationReservation = {
  documentSlug: string;
  route: string;
  idempotencyKey: string;
  requestHash: string;
  ownerToken: string;
};

export type MutationIdempotencyBeginResult =
  | { kind: 'execute'; reservation: MutationReservation }
  | { kind: 'replay'; statusCode: number; response: Record<string, unknown> }
  | { kind: 'mismatch' }
  | { kind: 'in_progress'; retryAfterSeconds: number }
  | { kind: 'result_unknown' };

export async function beginMutationReservation(args: {
  documentSlug: string;
  route: string;
  idempotencyKey: string;
  requestHash: string;
  mutationRoute: string;
  subsystem: string;
  slug: string;
  retryWithState?: string;
  leaseMs?: number;
  waitTimeoutMs?: number;
  waitPollMs?: number;
}): Promise<MutationIdempotencyBeginResult> {
  const {
    documentSlug,
    route,
    idempotencyKey,
    requestHash,
    mutationRoute,
    subsystem,
    slug,
    leaseMs = DEFAULT_PENDING_LEASE_MS,
  } = args;

  const reservation: MutationReservation = {documentSlug,route,idempotencyKey,requestHash,ownerToken:randomUUID()};
  const acquired=await reservePendingIdempotencyKey(documentSlug,route,idempotencyKey,requestHash,new Date(Date.now()+leaseMs).toISOString(),reservation.ownerToken);
  if(!acquired){
    const stored=await getMutationIdempotencyRecord(documentSlug,route,idempotencyKey);
    if(!stored)return {kind:'in_progress',retryAfterSeconds:1};
    if(stored.requestHash&&stored.requestHash!==requestHash)return {kind:'mismatch'};
    if(stored.state==='completed'&&stored.response)return {kind:'replay',statusCode:stored.statusCode??200,response:stored.response};
    const remaining=Date.parse(stored.leaseExpiresAt??'')-Date.now();
    if(!(remaining>0))return {kind:'result_unknown'};
    return {kind:'in_progress',retryAfterSeconds:Math.max(1,Math.ceil(remaining/1000))};
  }

  traceServerIncident({
    slug,
    subsystem,
    level: 'info',
    eventType: 'mutation_idempotency.reserved',
    message: 'Reserved mutation idempotency key before execution',
    data: {
      route: mutationRoute,
      idempotencyKey,
    },
  });

  return { kind: 'execute', reservation };
}

export async function completeMutationReservation(
  reservation: MutationReservation | null,
  response: Record<string, unknown>,
  statusCode: number,
  options?: { tombstoneRevision?: number | null; mutationRoute?: string; subsystem?: string; slug?: string },
): Promise<void> {
  if (!reservation) return;
  const completed=await completePendingIdempotencyKey(reservation.documentSlug,reservation.route,reservation.idempotencyKey,response,reservation.requestHash,reservation.ownerToken,{statusCode,tombstoneRevision:options?.tombstoneRevision??null});
  if(!completed)throw new Error('Mutation reservation ownership was lost before completion');
  if (options?.mutationRoute && options?.subsystem && options?.slug) {
    traceServerIncident({
      slug: options.slug,
      subsystem: options.subsystem,
      level: 'info',
      eventType: 'mutation_idempotency.completed',
      message: 'Completed mutation idempotency reservation with replayable response',
      data: {
        route: options.mutationRoute,
        idempotencyKey: reservation.idempotencyKey,
        statusCode,
      },
    });
  }
}

export async function releaseMutationReservation(
  reservation: MutationReservation | null,
  options?: { mutationRoute?: string; subsystem?: string; slug?: string; reason?: string },
): Promise<void> {
  if (!reservation) return;
  if(await hasDurableMutationRecordForIdempotencyKey(reservation.documentSlug,reservation.route,reservation.idempotencyKey))return;
  await releasePendingIdempotencyKey(reservation.documentSlug,reservation.route,reservation.idempotencyKey,reservation.ownerToken);
  if (options?.mutationRoute && options?.subsystem && options?.slug) {
    traceServerIncident({
      slug: options.slug,
      subsystem: options.subsystem,
      level: 'info',
      eventType: 'mutation_idempotency.released',
      message: 'Released pending mutation idempotency reservation without durable success',
      data: {
        route: options.mutationRoute,
        idempotencyKey: reservation.idempotencyKey,
        reason: options.reason ?? 'request_failed_before_commit',
      },
    });
  }
}
