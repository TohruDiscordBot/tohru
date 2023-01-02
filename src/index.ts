(await import("dotenv")).config();
import { client } from "./client.js";
import { loader } from "./utils/loader.js";
import { logger } from "./utils/logger.js";

logger.info("[CLIENT] Initializing...");

process.on("uncaughtException", (err: Error) => logger.error(err.message));

logger.info("[CLIENT] Loading events and commands...");

await loader(
    "dist/events",
    "dist/commands"
);

logger.info("[CLIENT] Loaded events and commands.");

client.login(process.env.DISCORD_TOKEN);

export { };