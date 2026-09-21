import { test } from "node:test";
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { Client, StreamableHTTPClientTransport } from "@modelcontextprotocol/client";
import { fixtureCatalog } from "../src/fixtures.mjs";

const waitForHealth = async (port) => {
  for (let attempt = 0; attempt < 60; attempt += 1) {
    try {
      const response = await fetch(`http://127.0.0.1:${port}/health`);
      if (response.ok) return;
    } catch {}
    await new Promise((resolve) => setTimeout(resolve, 50));
  }
  throw new Error(`mock on port ${port} did not start`);
};

const timeout = (milliseconds) => new Promise((resolve) => setTimeout(() => resolve(Symbol("timeout")), milliseconds));

test("all mock integrations pass through real HTTP and MCP client paths", { timeout: 10000 }, async () => {
  const child = spawn(process.execPath, ["scripts/start-mocks.mjs"], { stdio: ["ignore", "pipe", "pipe"] });
  const childExit = new Promise((resolve) => child.once("exit", (code, signal) => resolve({ code, signal })));
  let startup = "";
  const started = new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("mock startup timed out")), 3000);
    child.stdout.on("data", (chunk) => {
      startup += chunk.toString();
      const line = startup.split("\n").find((candidate) => candidate.startsWith("{"));
      if (!line) return;
      clearTimeout(timer);
      resolve(JSON.parse(line));
    });
    child.once("exit", (code, signal) => {
      clearTimeout(timer);
      reject(new Error(`mock process exited before startup (${code ?? signal})`));
    });
  });
  const clients = [];
  try {
    const startupResult = await started;
    assert.deepEqual(startupResult.servers.map(({ port }) => port), [48135, 48136, 48137, 48138]);
    await Promise.all([48135, 48136, 48137, 48138].map(waitForHealth));
    assert.equal(child.exitCode, null);
    const checks = [
      ["jira", 48136, "list_issues", {}],
      ["gitlab", 48137, "list_merge_requests", {}],
      ["confluence", 48138, "search_pages", { query: "settlement" }],
    ];
    for (const [kind, port, toolName, arguments_] of checks) {
      const client = new Client({ name: "training-lab-integration", version: "0.1.0" });
      clients.push(client);
      await client.connect(new StreamableHTTPClientTransport(new URL(`http://127.0.0.1:${port}/mcp`)));
      const listed = await client.listTools();
      assert.deepEqual(listed.tools.map((tool) => tool.name).sort(), Object.keys(fixtureCatalog[kind].tools).sort());
      const result = await client.callTool({ name: toolName, arguments: arguments_ });
      assert.equal(result.isError, undefined);
      const payload = JSON.parse(result.content[0].text);
      if (kind === "jira") {
        assert.deepEqual(payload.issues.map(({ key }) => key), ["TRAIN-101", "TRAIN-102"]);
        for (const { key } of payload.issues) {
          const detail = await client.callTool({ name: "get_issue", arguments: { key } });
          assert.equal(detail.isError, undefined);
          assert.equal(JSON.parse(detail.content[0].text).key, key);
        }
        const filtered = await client.callTool({ name: "list_issues", arguments: { status: "Open" } });
        assert.deepEqual(JSON.parse(filtered.content[0].text).issues.map(({ key }) => key), ["TRAIN-101"]);
        const missing = await client.callTool({ name: "get_issue", arguments: { key: "TRAIN-999" } });
        assert.equal(missing.isError, true);
      }
      if (kind === "gitlab") {
        assert.deepEqual(payload.mergeRequests.map(({ iid }) => iid), [7, 8]);
        for (const { iid } of payload.mergeRequests) {
          const detail = await client.callTool({ name: "get_merge_request", arguments: { iid } });
          assert.equal(detail.isError, undefined);
          assert.equal(JSON.parse(detail.content[0].text).iid, iid);
        }
        const filtered = await client.callTool({ name: "list_merge_requests", arguments: { state: "merged" } });
        assert.deepEqual(JSON.parse(filtered.content[0].text).mergeRequests.map(({ iid }) => iid), [8]);
        const missing = await client.callTool({ name: "get_merge_request", arguments: { iid: 999 } });
        assert.equal(missing.isError, true);
      }
      if (kind === "confluence") {
        assert.equal(payload.pages[0].id, "PAGE-201");
        assert.equal(payload.pages[0].body, "Use the ledger, PSP export, and reviewer checklist from the training fixture.");
        const absent = await client.callTool({ name: "search_pages", arguments: { query: "nonexistent fixture phrase" } });
        assert.deepEqual(JSON.parse(absent.content[0].text).pages, []);
        const missing = await client.callTool({ name: "get_page", arguments: { id: "PAGE-999" } });
        assert.equal(missing.isError, true);
      }
    }
    const weather = await fetch("http://127.0.0.1:48135/weather?city=Amsterdam&date=2026-09-21");
    assert.equal(weather.status, 200);
    assert.deepEqual(await weather.json(), { city: "Amsterdam", date: "2026-09-21", temperatureC: 17, condition: "light rain", precipitationProbability: 70 });
  } finally {
    await Promise.all(clients.map((client) => client.close().catch(() => undefined)));
    if (child.exitCode === null) child.kill("SIGTERM");
    let exit = await Promise.race([childExit, timeout(2000)]);
    if (typeof exit === "symbol") {
      child.kill("SIGKILL");
      exit = await Promise.race([childExit, timeout(2000)]);
    }
    assert.notEqual(typeof exit, "symbol", "mock process must exit during teardown");
  }
});
