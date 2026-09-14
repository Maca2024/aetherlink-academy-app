# Day 4: Claude Code review task

Use your own existing Claude Code setup; do not add an API key or external
integration. Read the local starter files and review the same fictional
`GL-REVIEW-001` task as day 3. Work read-only, keep a trace of commands and
observations, and place the following in the handoff:

1. input fixture and allowed tools;
2. finding, file and evidence;
3. deterministic check versus an actually observed AI run;
4. result of the human review; and
5. one open next step and its owner.

Attempt one clearly out-of-scope write only if the facilitator has supplied the
local hook exercise. The expected result is a blocked `PreToolUse` action; this
proves only that one guard fired, not that the review is correct.
