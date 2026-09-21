import { ports } from "../src/fixtures.mjs";
import { startAllMocks, stopAllMocks } from "../src/start-all.mjs";

let servers;
try {
  servers = await startAllMocks(ports);
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
}
if (!servers) process.exit();
console.log(JSON.stringify({ ok: true, servers: servers.map(({ name, port }) => ({ name, port })) }));
const close = () => stopAllMocks(servers).finally(() => process.exit(0));
process.once("SIGINT", close);
process.once("SIGTERM", close);
