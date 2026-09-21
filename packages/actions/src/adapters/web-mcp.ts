import type {ActionDescriptor} from './tool-adapter.ts';

export type {ActionDescriptor};

/**
 * Invokes one action by name against the real server-side dispatcher (e.g.
 * an authenticated `fetch` to the HttpApi endpoint, carrying the browser's
 * session cookie/token). This package never constructs a `Caller` or talks
 * to `ConfirmationStore` in the browser — authorization and confirmation
 * checks happen once, server-side, inside `dispatch`.
 */
export type RemoteActionInvoke = (name: string, payload: unknown, confirmationToken?: string) => Promise<unknown>;

export interface WebMcpTool extends ActionDescriptor {
  readonly call: (payload: unknown, confirmationToken?: string) => Promise<unknown>;
}

/**
 * Browser-safe adapter: takes serializable descriptors (produced server-side
 * by `describeActions`, sent over the wire) and an injected `invoke`
 * callback, and returns callable tools with no dependency on `dispatch`,
 * `ConfirmationStore`, or `node:crypto`. Transport wiring (how `invoke`
 * reaches the server) is the host's responsibility.
 */
export const toWebMcpTools = (descriptors: ReadonlyArray<ActionDescriptor>, invoke: RemoteActionInvoke): ReadonlyArray<WebMcpTool> =>
  descriptors.map((descriptor) => ({
    ...descriptor,
    call: (payload: unknown, confirmationToken?: string) => invoke(descriptor.name, payload, confirmationToken),
  }));
