import { fixtureCatalog, ports } from "./fixtures.mjs";
import { startMcpServer } from "./http-mcp.mjs";
import { startWeatherServer } from "./weather-http.mjs";

export const startAllMocks = async (portMap = ports) => {
  const servers = [];
  try {
    servers.push(await startWeatherServer({ port: portMap.weather }));
    servers.push(await startMcpServer({ catalog: fixtureCatalog.jira, port: portMap.jira }));
    servers.push(await startMcpServer({ catalog: fixtureCatalog.gitlab, port: portMap.gitlab }));
    servers.push(await startMcpServer({ catalog: fixtureCatalog.confluence, port: portMap.confluence }));
    return servers;
  } catch (error) {
    await Promise.all(servers.map(({ server }) => new Promise((resolve) => server.close(resolve))));
    throw error;
  }
};

export const stopAllMocks = async (servers) => {
  await Promise.all(servers.map(({ server }) => new Promise((resolve) => server.close(resolve))));
};
