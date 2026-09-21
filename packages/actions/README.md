# @academy/actions

AET-21 defines actions once and exposes them through HTTP, MCP, chat, and a browser callback adapter. This package builds on foundation PR #25. Host authentication and transport registration remain separate integration work.

## Define and register an action

```ts
const startTimer = defineAction({
  name: 'startTimer',
  input: Schema.Struct({seconds: Schema.Int.check(Schema.isBetween({minimum: 1, maximum: 3600}))}),
  output: Schema.Struct({startedAt: Schema.String, seconds: Schema.Number}),
  scope: 'facilitator',
  intent: 'explicit',
  run: (input, caller) => classroomTimer(input.seconds, caller.roomId),
});
const registry = registerAction(emptyRegistry, startTimer);
```

Schemas determine the handler's input and output types. Codecs must not require decoding or encoding services. Handler service requirements accumulate through registration and remain required by the dispatcher and HTTP handler layer. Compile-time fixtures test inference, invalid handler shapes, serviceful codecs, and missing handler services.

Registration returns a new registry and rejects duplicate names. `getParticipantCount` demonstrates adding one action file and one registry entry without changing the dispatcher or adapters. Use `EmptyInput` for actions accepting only `{}`; Effect 4 rc117's `Schema.Struct({})` alone is permissive.

## Authorization and confirmation

The host supplies `CallerResolver`, which validates its actual session or token and returns `{principalId, roomId, role}`. Transport credentials are untrusted until resolved. Payload fields cannot supply identity or grant a role.

The shared dispatcher validates input, checks scope, consumes confirmation for explicit actions, runs the handler, and validates/encodes output. All server adapters call this boundary. This avoids maintaining separate authorization policies in four adapters.

The trusted interactive host may mint a confirmation only after showing the human the proposed action. No model-facing tool exposes minting. Bind the token to the action name, schema-encoded payload hash, principal, and room. Tokens expire and are consumed once through an atomic `Ref.modify`. Invalid or mismatched tokens fail before the handler runs.

`hashEncoded` accepts JSON values only. It rejects non-finite numbers, unsupported objects, cycles, and values that JSON serialization would discard. For transforming codecs, encode the human-approved input using the action schema before hashing it. Dispatch repeats that encoding and hashing before consuming the token. Do not hash a decoded Date or Map directly.

`ConfirmationStoreLive` is process-local. Build it once for a host runtime and share that instance between minting and dispatch. A deployment spanning multiple processes needs a shared atomic store implementing the same interface.

The sample `ClassroomStateLive(roomId)` binds its state to one room; every sample action checks the trusted caller's room before accessing it.

## Adapters

- `toHttpApiGroup`, `ActionsHttpApi`, and `ActionsHttpHandlers` build schema-derived endpoints. Raw handlers read JSON and use the shared strict decoder, allowing normal HTTP headers while rejecting extra payload fields. Success schemas describe the encoded output, so transformations run once.
- `toMcpTools` and `toChatTools` produce descriptors and server-side call functions requiring `CallerResolver`. `toFullJsonSchema` preserves `$defs` for named and recursive schemas.
- Import `toWebMcpTools` from `@academy/actions/web-mcp` in the browser. It accepts serializable descriptors and an injected remote invocation callback. The callback must reach the authenticated server dispatcher; the browser adapter does not perform local authorization or mint confirmation. The root package entry is server-side.

The dynamic HTTP registry needs narrow assertions for endpoint and handler bookkeeping. Its public layer retains the action services, caller resolver, and confirmation store requirements. The registry's heterogeneous handler cast is internal; values reach handlers only after their corresponding schema decodes them.

## Verification and remaining integration

Run `pnpm --filter @academy/actions typecheck`, `test`, and `build`. Tests exercise in-process HTTP requests and MCP adapter call functions, transformed wire values, invalid input/output, room isolation, confirmation bindings/expiry/replay, JSON hashing, and browser bundling through the public export.

The 16-consumer confirmation regression uses scheduler budget 3, which reproduces the former split read/write race. Budget 1 stalls this Effect prerelease even for trivial programs.

These are package-level checks. Real SSO, MCP session registration, browser bridge wiring, durable confirmation storage, and deployed classroom acceptance belong to subsequent integration work.
