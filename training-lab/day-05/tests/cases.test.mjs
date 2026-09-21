import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

test("every day 5 case has a fictional dataset and a brief", () => {
  const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
  const cases = JSON.parse(readFileSync(path.join(root, "data/cases.json"), "utf8"));
  assert.equal(cases.length, 3);
  for (const entry of cases) {
    assert.equal(entry.fictional, true);
    assert.ok(entry.brief.length > 20);
    assert.ok(readFileSync(path.join(root, "data", entry.dataset), "utf8").length > 0);
  }
});
