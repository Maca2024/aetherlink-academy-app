# Day 2. Rebuild the weather agent

The same input and expected decision are wired into the Eve and Claude Agent SDK skeleton folders. The weather call stays local and deterministic so the model or shell does not change the acceptance result. The shared acceptance test executes the deterministic weather helper; it does not claim a model-backed Eve or Claude Agent SDK run.

Use `day-02/eve` for the guided directory layout. Use `day-02/claude-agent-sdk` for the solo starter. `mastra` and `adk-go` are optional reading paths.

Preflight requires the participant's own model credential. No credential belongs in this repository. If the chosen model is unavailable, run the deterministic acceptance test and record the missing model run as open.
