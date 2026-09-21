import http from "node:http";
import { createMcpHandler } from "@modelcontextprotocol/server";
import { toNodeHandler } from "@modelcontextprotocol/node";
import { createFixtureMcpServer } from "./mcp-server.mjs";

const maxBodyBytes = 64 * 1024;

const readJson = async (request) => {
  const chunks = [];
  let bytes = 0;
  for await (const chunk of request) {
    bytes += chunk.length;
    if (bytes > maxBodyBytes) throw Object.assign(new Error("Request body is too large"), { statusCode: 413 });
    chunks.push(chunk);
  }
  if (!chunks.length) return {};
  try {
    return JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } catch {
    throw Object.assign(new Error("Request body must be valid JSON"), { statusCode: 400 });
  }
};

export const startMcpServer = ({ catalog, port, host = "127.0.0.1" }) => {
  const handler = toNodeHandler(createMcpHandler(() => createFixtureMcpServer(catalog), { legacy: "stateless", responseMode: "json" }), { onerror: (error) => console.error(`[${catalog.name}]`, error) });
  const server = http.createServer(async (request, response) => {
    if (request.url !== "/mcp" || request.method !== "POST") {
      response.writeHead(request.url === "/health" ? 200 : 404, { "content-type": "application/json" });
      response.end(JSON.stringify(request.url === "/health" ? { ok: true, server: catalog.name } : { error: "Not found" }));
      return;
    }
    try {
      await handler(request, response, await readJson(request));
    } catch (error) {
      if (!response.headersSent) response.writeHead(error?.statusCode ?? 500, { "content-type": "application/json" });
      response.end(JSON.stringify({ error: error?.statusCode ? error.message : "Internal server error" }));
    }
  });
  return new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(port, host, () => resolve({ name: catalog.name, port, server }));
  });
};
