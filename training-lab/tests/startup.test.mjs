import { test } from "node:test";
import assert from "node:assert/strict";
import http from "node:http";
import { startAllMocks } from "../src/start-all.mjs";
import { startWeatherServer } from "../src/weather-http.mjs";

const listen = (server, port) => new Promise((resolve, reject) => {
  server.once("error", reject);
  server.listen(port, "127.0.0.1", resolve);
});

test("startup failure closes listeners already opened by the same attempt", async () => {
  const occupied = http.createServer((_request, response) => response.end());
  await listen(occupied, 49237);
  try {
    await assert.rejects(() => startAllMocks({ weather: 49235, jira: 49236, gitlab: 49237, confluence: 49238 }));
    await assert.rejects(() => fetch("http://127.0.0.1:49235/health"));
  } finally {
    await new Promise((resolve) => occupied.close(resolve));
  }
});

test("weather mock returns a bounded client error for a malformed request URL", async () => {
  const { server } = await startWeatherServer({ port: 0 });
  try {
    const result = await new Promise((resolve, reject) => {
      const request = http.request({ host: "127.0.0.1", port: server.address().port, path: "/%zz" }, (response) => {
        let body = "";
        response.on("data", (chunk) => { body += chunk; });
        response.on("end", () => resolve({ status: response.statusCode, body: JSON.parse(body) }));
      });
      request.once("error", reject);
      request.end();
    });
    assert.deepEqual(result, { status: 400, body: { error: "Invalid request URL" } });
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});
