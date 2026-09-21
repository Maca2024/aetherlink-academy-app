import { fixtureCatalog, ports } from "../../src/fixtures.mjs";
import { startMcpServer } from "../../src/http-mcp.mjs";

const { server } = await startMcpServer({ catalog: fixtureCatalog.jira, port: ports.jira });
const close = () => server.close(() => process.exit(0));
process.once("SIGINT", close);
process.once("SIGTERM", close);
