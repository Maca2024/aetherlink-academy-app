import http from "node:http";
import { runFixture } from "./effect-runtime.mjs";
import { weatherFixtures } from "./fixtures.mjs";

export const startWeatherServer = ({ port, host = "127.0.0.1" }) => {
  const server = http.createServer(async (request, response) => {
    if (/%(?![0-9a-fA-F]{2})/.test(request.url ?? "")) {
      response.writeHead(400, { "content-type": "application/json" });
      response.end(JSON.stringify({ error: "Invalid request URL" }));
      return;
    }
    let url;
    try {
      url = new URL(request.url ?? "/", "http://127.0.0.1");
    } catch {
      response.writeHead(400, { "content-type": "application/json" });
      response.end(JSON.stringify({ error: "Invalid request URL" }));
      return;
    }
    if (url.pathname === "/health") {
      response.writeHead(200, { "content-type": "application/json" });
      response.end(JSON.stringify({ ok: true, server: "training-weather" }));
      return;
    }
    if (url.pathname !== "/weather" || request.method !== "GET") {
      response.writeHead(404, { "content-type": "application/json" });
      response.end(JSON.stringify({ error: "Not found" }));
      return;
    }
    const fixture = weatherFixtures[`${url.searchParams.get("city")}|${url.searchParams.get("date")}`];
    if (!fixture) {
      response.writeHead(404, { "content-type": "application/json" });
      response.end(JSON.stringify({ error: "No deterministic fixture for city and date" }));
      return;
    }
    response.writeHead(200, { "content-type": "application/json", "cache-control": "no-store" });
    response.end(JSON.stringify(await runFixture(() => fixture)));
  });
  return new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(port, host, () => resolve({ name: "training-weather", port, server }));
  });
};
