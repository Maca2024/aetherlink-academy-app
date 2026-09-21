import { test } from "node:test";
import assert from "node:assert/strict";
import { fetchWeatherDecision as eveDecision } from "../eve/agent.mjs";
import { fetchWeatherDecision as claudeDecision } from "../claude-agent-sdk/agent.mjs";
import { withEphemeralMocks } from "../../tests/test-mocks.mjs";

test("Eve and Claude Agent SDK starters share one observable decision", async () => {
  await withEphemeralMocks(async ({ "training-weather": baseUrl }) => {
    const input = { baseUrl, city: "Amsterdam", date: "2026-09-21" };
    const [eve, claude] = await Promise.all([eveDecision(input), claudeDecision(input)]);
    assert.equal(eve.decision, "bring umbrella");
    assert.equal(claude.decision, "bring umbrella");
    assert.deepEqual(eve.weather, claude.weather);
  });
});
