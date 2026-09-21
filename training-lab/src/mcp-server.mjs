import { fromJsonSchema, McpServer } from "@modelcontextprotocol/server";
import { runFixture } from "./effect-runtime.mjs";

export const createFixtureMcpServer = (catalog) => {
  const server = new McpServer({ name: catalog.name, version: catalog.version });
  for (const [name, definition] of Object.entries(catalog.tools)) {
    server.registerTool(name, {
      description: definition.description,
      inputSchema: fromJsonSchema(definition.inputSchema),
      annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false },
    }, async (input) => {
      const value = await runFixture(() => definition.run(input ?? {}));
      const isError = Boolean(value && typeof value === "object" && "error" in value);
      return {
        ...(isError ? { isError: true } : {}),
        content: [{ type: "text", text: JSON.stringify(value) }],
      };
    });
  }
  return server;
};
