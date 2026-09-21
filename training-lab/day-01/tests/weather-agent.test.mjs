import { test } from "node:test";
import assert from "node:assert/strict";
import { fetchWeatherDecision } from "../starter/weather-agent.mjs";
import { withEphemeralMocks } from "../../tests/test-mocks.mjs";

test("day 1 starter makes the deterministic Amsterdam decision", async () => {
  await withEphemeralMocks(async ({ "training-weather": baseUrl }) => {
    const result = await fetchWeatherDecision({ baseUrl, city: "Amsterdam", date: "2026-09-21" });
    assert.equal(result.weather.city, "Amsterdam");
    assert.equal(result.decision, "bring umbrella");
  });
});
