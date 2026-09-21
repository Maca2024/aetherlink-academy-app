import {Context, type Effect} from 'effect';
import type {Caller} from './caller.ts';
import type {CallerResolutionFailed} from './errors.ts';

/**
 * Resolves an opaque, transport-level token/session id (untrusted, supplied
 * by the caller) into a trusted `Caller`. This package does not implement
 * real SSO or session validation — the host application must inject a
 * resolver backed by its actual authentication system. Every adapter in
 * `adapters/` accepts a resolver through this service rather than trusting
 * any field in the request payload.
 */
export interface CallerResolverShape {
  readonly resolve: (token: string) => Effect.Effect<Caller, CallerResolutionFailed>;
}

export class CallerResolver extends Context.Service<CallerResolver, CallerResolverShape>()(
  '@academy/actions/CallerResolver',
) {}
