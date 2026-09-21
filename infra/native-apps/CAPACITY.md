# Native app suite capacity baseline

Live read-only measurement: 2026-09-21 18:34 UTC.
Evidence: https://github.com/RyanLisse/aetherlink-academy-app/actions/runs/35639282838

| Resource | Observed |
| --- | --- |
| vCPU | 4 |
| RAM | 7751 MiB total; 4280 MiB available |
| Swap | none |
| Root filesystem | 75 GB; 58 GB used; 14 GB free; 81% |
| Academy authoring PoC idle memory | 222.3 MiB |
| Slides PoC idle memory | 234.7 MiB |
| Docker images | 23.83 GB total; reported reclaimable 14.75 GB |
| Docker build cache | 39.25 GB total; reported reclaimable 21.34 GB |

Docker shared-layer/cache totals can overlap. Do not add reclaimable figures or
blindly prune production/rollback images or volumes. All 12 containers were up;
Academy production, Academy PoC and Slides healthchecks were healthy.

## Decision

Disk headroom is the immediate rollout constraint. Audit retained builds and
perform scoped cache cleanup or expand storage before five additional builds.
Prefer CI/external builds; otherwise build sequentially. These idle measurements
do not establish concurrent-agent or media-render capacity. Measure per-app RSS,
CPU, queue delay, p95 response latency and disk growth at the intended class size.
A 16 GB RAM host or separate render/agent worker is a sizing candidate, not a
measured requirement or an approved purchase. No resize has been performed.

## Access

Existing GitHub Actions SSH credentials successfully ran the read-only audit.
Local 1Password/SSH authorization and the OpenShip API session are unavailable.
New OpenShip-managed deployment is not completed. An authorized OpenShip API
session/service credential is still required; do not bypass auth or silently
replace managed deployment with standalone Docker containers.

## Hetzner control-plane check

Installed official hcloud CLI v1.68.0. Context list is empty; both `hcloud server
list` and `hcloud server-type list` fail with `no active context or token`.
No HCLOUD_TOKEN is configured; GitHub contains only existing SSH deployment
secrets. A read-only token for the correct Hetzner project is required to inspect
existing second servers, quotas and location-specific model availability.

After authentication, use:

```sh
hcloud server list -o json
hcloud server-type list -o columns=name,cores,memory,disk,architecture,location,location_available
hcloud location list
```

Do not interpret a failed inventory as an empty project. Compare a resize with a
second x86 app/media host in the appropriate network zone; inspect workloads on
any existing candidate before reuse. No server was created, resized or deleted.
Exact pricing is pending authenticated lookup. Hetzner changed pricing for new
orders and rescales on 15 June 2026; existing unchanged servers are unaffected:
https://docs.hetzner.cloud/whats-new
