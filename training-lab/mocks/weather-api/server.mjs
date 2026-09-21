import { ports } from "../../src/fixtures.mjs";
import { startWeatherServer } from "../../src/weather-http.mjs";

const { server } = await startWeatherServer({ port: ports.weather });
const close = () => server.close(() => process.exit(0));
process.once("SIGINT", close);
process.once("SIGTERM", close);
