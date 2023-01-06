import { client } from "./client.js";
import { loader } from "./utils/loader.js";
import { logger } from "./utils/logger.js";
import "./db/index.js";

logger.info(`[CLIENT] [SHARD #${client.shard.ids}] Initializing...`);

process.on("uncaughtException", (err: Error) => logger.error(`[CLIENT] [SHARD #${client.shard.ids}] ` + err));

logger.info(`[CLIENT] [SHARD #${client.shard.ids}] Loading events and commands...`);

await loader(
    "dist/events",
    "dist/commands"
);

logger.info(`[CLIENT] [SHARD #${client.shard.ids}] Loaded events and commands.`);

await client.login(process.env.DISCORD_TOKEN);