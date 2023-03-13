import { client } from "./client.js";
import { loader } from "./utils/loader.js";
import { logger } from "./utils/logger.js";
await import("./db/index.js")

logger.info("Initializing...");

process.on("uncaughtException", (err: Error) => {
    logger.error(err);
    logger.error(err.cause);
});

logger.info("Loading events and commands...");

await loader(
    "dist/events",
    "dist/commands",
    "dist/preconditions"
);

logger.info("Loaded events and commands.");

await client.login(process.env.DISCORD_TOKEN);