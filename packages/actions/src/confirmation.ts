import {randomUUID} from 'node:crypto';
import {Context, Effect, Layer, Ref} from 'effect';
import {ActionConfirmationRejected} from './errors.ts';

/**
 * Everything a confirmation token is bound to. `consume` rejects unless all
 * four fields match exactly, so a token minted for one action/payload/room
 * cannot be replayed against another.
 */
export interface ConfirmationBinding {
  readonly actionName: string;
  readonly payloadHash: string;
  readonly principalId: string;
  readonly roomId: string;
}

interface ConfirmationRecord extends ConfirmationBinding {
  readonly expiresAt: number;
}

export interface ConfirmationStoreShape {
  /**
   * Mints a single-use token bound to `binding`, valid for `ttlMs` from now.
   * Must only ever be called by the trusted interactive host (the UI flow
   * that shows the confirmation dialog to a human) — minting is excluded
   * from every adapter in this package.
   */
  readonly mint: (binding: ConfirmationBinding, ttlMs: number) => Effect.Effect<string>;
  readonly consume: (token: string, binding: ConfirmationBinding) => Effect.Effect<void, ActionConfirmationRejected>;
}

export class ConfirmationStore extends Context.Service<ConfirmationStore, ConfirmationStoreShape>()(
  '@academy/actions/ConfirmationStore',
) {}

export const ConfirmationStoreLive: Layer.Layer<ConfirmationStore> = Layer.effect(
  ConfirmationStore,
  Effect.gen(function* () {
    const store = yield* Ref.make(new Map<string, ConfirmationRecord>());

    const mint: ConfirmationStoreShape['mint'] = (binding, ttlMs) =>
      Effect.gen(function* () {
        if (!Number.isFinite(ttlMs) || ttlMs <= 0) {
          return yield* Effect.die(new Error(`ttlMs must be a finite positive number, got ${ttlMs}`));
        }
        const token = randomUUID();
        yield* Ref.update(store, (map) => {
          const next = new Map(map);
          next.set(token, {...binding, expiresAt: Date.now() + ttlMs});
          return next;
        });
        return token;
      });

    const reject = (name: string, reason: string) => new ActionConfirmationRejected({name, reason});

    const consume: ConfirmationStoreShape['consume'] = (token, binding) =>
      Ref.modify(store, (map) => {
        const record = map.get(token);
        if (!record) return [reject(binding.actionName, 'unknown confirmation token'), map];
        if (record.expiresAt <= Date.now()) {
          const next = new Map(map);
          next.delete(token);
          return [reject(binding.actionName, 'confirmation expired'), next];
        }
        if (
          record.actionName !== binding.actionName ||
          record.payloadHash !== binding.payloadHash ||
          record.principalId !== binding.principalId ||
          record.roomId !== binding.roomId
        ) {
          return [reject(binding.actionName, 'confirmation does not match action, payload, principal, or room'), map];
        }
        const next = new Map(map);
        next.delete(token);
        return [undefined, next];
      }).pipe(Effect.flatMap((outcome) => (outcome === undefined ? Effect.void : Effect.fail(outcome))));

    return {mint, consume};
  }),
);
