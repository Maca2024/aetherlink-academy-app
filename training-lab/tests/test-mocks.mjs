import { startAllMocks, stopAllMocks } from "../src/start-all.mjs";

export const withEphemeralMocks = async (run) => {
  const servers = await startAllMocks({ weather: 0, jira: 0, gitlab: 0, confluence: 0 });
  const urls = Object.fromEntries(servers.map(({ name, server }) => [name, `http://127.0.0.1:${server.address().port}`]));
  try {
    return await run(urls);
  } finally {
    await stopAllMocks(servers);
  }
};
