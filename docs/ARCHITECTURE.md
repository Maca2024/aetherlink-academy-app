# Academy MVP architecture

React/Vite browser → authenticated game HTTP service → official Proof SDK server → SQLite + Yjs/Hocuspocus.

Each participant's existing Claude Code → stdio MCP adapter → restricted game MCP HTTP endpoints → Proof HTTP agent bridge. There are no model calls or Anthropic credentials in the app. The unused upstream src/agent code is not imported or bundled by this app; no Anthropic SDK dependency was added.

Room state persists in an atomically replaced private JSON file; Proof owns the sole document in SQLite. A single game process owns room mutations. Browsers poll room state every 2 seconds and render timers from server timestamps; Proof uses real WebSocket CRDT synchronization, not polling or a textarea. The timer never rotates at expiry. The facilitator explicitly advances round, SDLC phase, support day and activity independently.

## Boundaries

- Random room code is an invitation capability, not identity verification. A typed name is a display name. Minimum 4 / maximum 5 participants; facilitator is separate. Exactly one driver among joined participants. Roles express the workshop's mob workflow. All human squad members can concurrently edit/comment in Proof; document edit permission is not locked to the current driver. The game review controls are restricted to driver/facilitator. Proof's native human editor also offers review actions.
- Host creation key is generated into .data/host-key; never returned by the app. Proof owner secrets stay on the server. Browser sessions and personal MCP sessions are separate 256-bit random capabilities, hashed in the room session registry and valid 12 hours. The underlying scoped Proof editor token exists in the embedded editor, but the gateway independently requires a valid browser session and matching document slug. Proof itself binds only loopback.
- Personal MCP tokens have only five tools: mission, document, knowledge search, evidence submission and suggestions. They cannot use browser/facilitator endpoints, arbitrary Proof routes, accept suggestions, or access a specified different room. Identity on submissions comes from the token; callers cannot choose another author. Minting a new MCP token revokes the previous one for that attendee.
- Browser sessionStorage keeps the reconnect token; HttpOnly SameSite=Strict cookie authenticates the embedded editor. Use one participant/room per browser profile. Multiple tabs in the same profile share the editor cookie, so use separate profiles for multiple test identities. No SSO, roster removal, session-recovery UI, durable offline queue for evidence, or production tenancy administration yet.
- Evidence writes serialize through the game and use a stable participant/request idempotency key in Proof. A failed request does not display success. Retrying evidence with the same key avoids duplicate room entries. Suggested text remains separate until a human accepts. Human review of evidence is a record of a decision, not an automatic test of its truth.
- Quiz results and assistance levels are private to learner (facilitator sees score); the room roster has no rankings. The 3-question routing is an explicitly provisional assistance choice. Observed task competence is assessed through human review, not inferred from quiz recall.
- Default is local only. A multi-computer pilot requires a private network/SSH tunnel or reviewed HTTPS/WSS deployment and matching public WebSocket URL. Do not expose raw Proof port 4400. No public deployment performed.

## Proof pin and adjustments

Source: https://github.com/EveryInc/proof-sdk at fb2578758f1c62776301209131181643c5f4a19a (MIT, license retained). Copied under vendor/proof-sdk with exact pnpm lockfile. Direct imports absent from upstream package.json were explicitly declared: @milkdown/prose, @milkdown/transformer, y-protocols, lib0, remark-parse, remark-stringify, unified. Native builds are allowlisted for better-sqlite3 and esbuild.

Small upstream integration changes: bind HTTP to HOST/loopback; serve built editor assets; include slug in Hocuspocus connection parameters for the room gateway; explicitly connect. COLLAB_PUBLIC_BASE_URL is set to the gateway /ws to avoid upstream localhost port+1 inference. Agent bridge sends the protocol 3 compatibility headers required by the pinned SDK's client-capabilities.ts. Seed markdown has standard blank lines after headings to match canonical serialization; otherwise this upstream version reports PROJECTION_STALE before any browser opens. Tests verify headless comments/suggestions work.

Proof remains the continuous rich editor, provenance/marks engine, HTTP bridge, canonical document store and live collaboration server. Academy styles its embedded editor and reads its real sync status. Some native Proof selection/comment controls remain English and use upstream styling; the Academy shell and learning content are Dutch. Browser chat/terminal control is not connected.

## Liveblocks assessment — 13 September 2026

Recommendation: if hosted presence/event delivery is wanted, add Liveblocks behind the room transport boundary. Keep the game service authoritative for facilitator actions and Proof authoritative for document content. Do not synchronize a second copy of the Proof document into Liveblocks.

Liveblocks Yjs supports Y.Doc + awareness but is not a drop-in replacement for Proof's Hocuspocus live document map, SQLite projections, authorization epochs and HTTP mark/suggestion semantics. Full replacement requires an adapter and concurrency/provenance tests. REST binary Yjs updates alone do not reproduce the Proof bridge.

Requires a Liveblocks project and server-only service secret, plus a room-scoped authorization endpoint. This is separate from Anthropic; no participant model API keys needed. No Liveblocks account, credentials, subscription or transport was configured in this MVP.

Verified official references:
- https://liveblocks.io/docs/api-reference/liveblocks-yjs
- https://liveblocks.io/docs/api-reference/rest-api-endpoints
- https://liveblocks.io/docs/authentication/permissions
- https://liveblocks.io/docs/pricing/plans

At review time: Free has 3,000 collaboration minutes and can pause over-limit features; Pro is $30/month or $25/month annual with $30 credits, then usage charges. Collaboration metering is $0.002/minute. Confirm projected workshop usage and current terms before choosing a paid plan.

## HTTP MCP en containerupdate

Streamable HTTP `/mcp` gebruikt stateless SDK-transports met authenticatie per request en opnieuw per toolcall. De bestaande stdio-adapter deelt dezelfde vijf tooldefinities. `/game/connection` levert de geconfigureerde origin en onderscheidt localhost van ingestelde HTTPS; externe bereikbaarheid is apart te verifiëren. Tokens blijven squadgebonden, twaalf uur geldig en revocable. OAuth is niet geïmplementeerd.

`scripts/start.mjs` zet snapshots onder ACADEMY_DATA en kopieert bestaande snapshots zonder nieuwere exemplaren te overschrijven. De supervisor stopt bij uitval van Proof en wacht bij SIGTERM op het kindproces. De nieuwe Dockerconfiguratie is bedoeld voor één persistente host. De gekozen Vercel-migratie, inclusief Postgres-snapshots en Redis-pubsub, staat in [DEPLOYMENT.md](DEPLOYMENT.md); deze adapters zijn nog niet gebouwd.

De laatste browserwalkthrough reproduceert een hang met comments plus pending replacement. Dit is een open releaseblocker ondanks geslaagde protocoltests. Zie [actueel browserrapport](../../demo/VERIFICATION.md).
