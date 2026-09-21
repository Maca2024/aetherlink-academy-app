import {Schema} from 'effect';
import {FacilitatorCredentialId, RoomId} from './ids.ts';

/**
 * Ciphertext only. No plaintext, provider token, or password field exists on this
 * schema; decrypting is the sole responsibility of a server-side secret-holding
 * service that is out of scope for this package.
 */
export const FacilitatorCredential = Schema.Struct({
  id: FacilitatorCredentialId,
  roomId: RoomId,
  algorithm: Schema.Literals(['aes-256-gcm']),
  cipherText: Schema.String,
  nonce: Schema.String,
  createdAt: Schema.String,
});
export type FacilitatorCredential = Schema.Schema.Type<typeof FacilitatorCredential>;

export const decodeFacilitatorCredential = (input: unknown): FacilitatorCredential => Schema.decodeUnknownSync(FacilitatorCredential)(input);
