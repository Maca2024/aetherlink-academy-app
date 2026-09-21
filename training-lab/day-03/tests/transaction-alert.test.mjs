import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { alertForTransaction } from "../starter/transaction-alert.mjs";

test("day 3 starter explains the seeded deviation", () => {
  const rows = JSON.parse(readFileSync(path.join(path.dirname(fileURLToPath(import.meta.url)), "../data/transactions.json"), "utf8"));
  assert.deepEqual(alertForTransaction(rows.find((row) => row.id === "TX-FIC-302")), {
    alert: true,
    reason: "amount exceeds the fictional review threshold",
    severity: "high",
  });
});
