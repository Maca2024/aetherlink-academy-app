export type ActionRole = 'facilitator' | 'participant';

/**
 * A trusted, host-resolved caller. Never construct this from untrusted
 * request payloads — it must come from a session/token resolver the host
 * controls (see `CallerResolver`).
 */
export interface Caller {
  readonly principalId: string;
  readonly roomId: string;
  readonly role: ActionRole;
}
