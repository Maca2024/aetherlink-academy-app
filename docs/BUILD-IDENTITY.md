# Build identity

CI determines the revision with `git rev-parse HEAD` from the checkout and passes that exact value as Docker `SOURCE_REVISION` build argument. The runtime image retains it as `SOURCE_REVISION` and OCI revision label. Record the resulting image ID as a separate fact: a commit SHA identifies source, not image bytes.

`/game/health` reports the build's `SOURCE_REVISION`, baked in at image build time. A legacy `VERCEL_GIT_COMMIT_SHA` lookup still takes precedence if present, but nothing sets it now that Academy runs on Hetzner. Missing identity remains null/unknown and fails deployed smoke.

Do not manually set the revision to manufacture an expected result. Compare the reported value with the commit the Hetzner rebuild was driven from and the recorded repository commit.

`EXPECTED_REVISION` is required and must be the full verified source SHA. A matching health response establishes the intended identity contract; successful container runtime and deployed acceptance remain separate checks.

Sources:
- https://docs.docker.com/build/building/variables/
