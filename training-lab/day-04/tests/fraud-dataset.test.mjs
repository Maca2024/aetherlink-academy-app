import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { analyzeTransaction } from "../starter/analyze.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const csvPath = path.join(root, "data/transactions.csv");
const hash = () => createHash("sha256").update(readFileSync(csvPath)).digest("hex");
const expected = JSON.parse(readFileSync(path.join(root, "tests/expected.json"), "utf8"));

test("day 4 generator is deterministic and reference solution finds all seeded cases", () => {
  execFileSync(process.execPath, [path.join(root, "data/generate.mjs")]);
  const firstHash = hash();
  assert.equal(firstHash, expected.csvSha256);
  execFileSync(process.execPath, [path.join(root, "data/generate.mjs")]);
  assert.equal(hash(), firstHash);
  const rows = readFileSync(csvPath, "utf8").trim().split("\n").slice(1).map((line) => {
    const [id, time, region, merchant_category, payment_method, device, expected_risk, amount_eur] = line.split(",");
    return { id, time, region, merchant_category, payment_method, device, expected_risk, amount_eur };
  });
  const suspicious = rows.filter((row) => analyzeTransaction(row).risk === "high").map((row) => row.id);
  assert.deepEqual(suspicious, ["TX-FIC-402", "TX-FIC-404", "TX-FIC-406"]);
  assert.equal(new Set(suspicious).size, suspicious.length);
});
