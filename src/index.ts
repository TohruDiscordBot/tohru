(await import("dotenv")).config();
import { Shard, ShardingManager } from "discord.js";
import { logger } from "./utils/logger.js";

const manager: ShardingManager = new ShardingManager(
    "dist/launch.js",
    {
        token: process.env.DISCORD_TOKEN,
        respawn: true,
        totalShards: "auto"
    }
);

manager.on("shardCreate", (shard: Shard) => {
    logger.info(`[SHARDING MANAGER] Shard #${shard.id} spawned.`)
});

await manager.spawn();