# Rollback Academy

Rollback changes traffic routing; it does not reverse PostgreSQL migrations or restore documents. Before release, record the previous production deployment and verify that the previous application version can read the current schema. Use additive migrations and keep old fields until the rollback window closes.

## Vercel Hobby procedure

1. Open the separate Academy project and identify the failed deployment and previous known-good production deployment from the release evidence. Do not operate on `aetherlink-game-lab`.
2. Use the authenticated Vercel CLI: `vercel rollback <previous-deployment-url-or-id> --scope ryan-lisses-projects`.
3. Wait for `vercel rollback status --scope ryan-lisses-projects` to confirm completion.
4. Run deployed smoke against the production alias and the expected previous revision. Recheck document read/edit, reconnect, room state and MCP authentication.
5. Record operator, timestamp, deployment IDs, smoke artifact and any data compatibility issue.

Hobby supports rollback to the previous production deployment only. The first deployment has no previous healthy version: it must remain unaccepted if it fails. Do not invent a recovery target.

Following rollback, automatic production domain assignment stays disabled. Restore the intended release process with `vercel promote <verified-deployment-url> --scope ryan-lisses-projects` after the fix passes checks. Confirm the target project before running either command.

Existing WebSockets may remain attached to old instances until they close. Browser/MCP reconnect checks must therefore validate the new connection, not just an already-open tab. On Hobby the Function duration limit is 300 seconds; client recovery is part of acceptance.

If a schema change prevents safe application rollback, pause promotion and escalate to the release owner with the exact incompatibility. Do not delete production data or apply a destructive reverse migration automatically.

Sources verified 2026-09-13:
- https://vercel.com/docs/deployments/rollback-production-deployment
- https://vercel.com/docs/functions/container-images
- https://vercel.com/docs/functions/websockets
- https://vercel.com/docs/functions/limitations
