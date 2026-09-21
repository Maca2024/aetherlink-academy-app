# Effect v4 RC migration notes (F0-FOUNDATION)

## Pinned versions

| Package | Version | Where |
| --- | --- | --- |
| `effect` | `4.0.0-rc.117` | pnpm catalog `effect4`, used by `apps/server` |
| `@effect/sql-pg` | `4.0.0-rc.117` | catalog `effect4` |
| `@effect/platform-node` | `4.0.0-rc.117` | catalog `effect4` |
| `effect` (legacy root app) | `3.22.2` | root `package.json`, unchanged |
| `@typescript/native-preview` (`tsgo`) | `7.0.0-dev.20260707.2` | root devDependencies |
| `@typescript/typescript6` (`tsc6`) | `6.0.2` | root devDependencies, `pnpm tsc6` |
| `vitest` | `5.0.1` | root devDependencies |

The legacy app keeps Effect 3 through the root `dependencies`; the new workspace packages resolve Effect 4 through `catalog:effect4`. pnpm keeps both trees separate. `minimumReleaseAgeExclude` entries were added by pnpm for the RC packages.

## Renames and API differences hit while building apps/server

- `Effect.async` → `Effect.callback`.
- `Context.Tag` → `Context.Service<Self, Shape>()("key")` (class form). `Context.GenericTag` is gone; `Context.Service("key")` is the function form.
- `Layer.effect(Tag, effect)` still exists but is also curried: `Layer.effect(Tag)(effect)`. `Layer.scoped` no longer exists; scoped acquisition goes through `Layer.effect` with `Effect.acquireRelease` inside.
- `Effect.result` replaces `Effect.either` for `Result<A, E>` (`_tag: 'Success' | 'Failure'`, failure under `.failure`).
- `Effect.timeout` fails with `Cause.TimeoutError` (was `TimeoutException`).
- `@effect/platform` is folded into `effect/unstable/http` and `effect/unstable/httpapi`; `HttpApiBuilder.serve` is replaced by `HttpRouter.serve(appLayer)` plus `NodeHttpServer.layer`. `HttpApiBuilder.layer(api)` needs `FileSystem | Path | HttpPlatform | Etag.Generator`, provided by `NodeHttpServer.layer` (or `NodeHttpServer.layerHttpServices` in tests with `HttpRouter.toWebHandler`).
- `HttpApiGroup.make(id, {topLevel: true})` and `.add(endpoint)`; `HttpApiEndpoint.get(name, path, {success, error})` takes schemas in the options object.
- `HttpApiSchema.status(503)` is applied with `.pipe` on a `Schema.Struct` to give an error schema its status; the handler returns the plain object via `Effect.fail`.
- `Schema` lives in `effect` (`Schema.Struct`, `Schema.NullOr`, `Schema.Literal`).
- `@effect/sql-pg`: `PgClient.layer({url: Redacted.make(...), ssl, maxConnections, connectTimeout})`; connections open lazily, so the layer builds while Postgres is down and probes fail per query instead of at startup.
- `Data.TaggedError` unchanged.
- No Effect Redis module was used: `@effect/platform-node`'s `NodeRedis` needs the `redis` (node-redis) peer; the server wraps `ioredis` in its own `Context.Service` to match the legacy dependency.

## TypeScript 7 (tsgo)

- `tsgo --noEmit -p tsconfig.json` for typecheck and `tsgo -p tsconfig.build.json` for emit; `tsconfig.base.json` uses `module: nodenext`, `verbatimModuleSyntax`, `rewriteRelativeImportExtensions` so sources import `.ts` and emit `.js`.
- JSON imports need `with {type: 'json'}` under `nodenext`.
- `@types/node` must be declared in each package that sets `types: ["node"]`; tsgo does not fall back to the workspace root.

## Runtime verification boundary

The foundation runtime contract is represented by `infra/compose.yaml`: the
Compose-owned Postgres and Redis services use generated local certificates,
and the app and Proof child trust their CA through `NODE_EXTRA_CA_CERTS`.
The workflow defines the revision health check and Postgres outage/recovery
check against that same stack. These checks are evidence only after a CI run
or the documented local integration command completes; repository files and
Compose configuration alone do not prove a running or deployed environment.
