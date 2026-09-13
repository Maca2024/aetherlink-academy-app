# Build identity

CI determines the revision with `git rev-parse HEAD` from the checkout and passes that exact value as Docker `SOURCE_REVISION` build argument. The runtime image retains it as `SOURCE_REVISION` and OCI revision label. Record the resulting image ID as a separate fact: a commit SHA identifies source, not image bytes.

Vercel Git deployments provide `VERCEL_GIT_COMMIT_SHA` at runtime when automatic system environment variable exposure is enabled. `/game/health` returns this value first, otherwise the CI image's `SOURCE_REVISION`. Missing identity remains null/unknown and fails deployed smoke.

Do not assume Vercel forwards host environment variables into Docker ARG. Do not manually set `VERCEL_GIT_COMMIT_SHA` to manufacture an expected result. Compare it with the deployed Git source revision returned by Vercel and the recorded repository commit.

`EXPECTED_REVISION` is required and must be the full verified source SHA. A matching health response establishes the intended identity contract; successful container runtime and deployed acceptance remain separate checks.

Sources:
- https://vercel.com/docs/environment-variables/system-environment-variables
- https://docs.docker.com/build/building/variables/
