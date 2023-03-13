(await import("dotenv")).config();
import { logger } from "./utils/logger.js";
import { Cluster, ClusterManager } from "discord-hybrid-sharding";
import { IS_DEV } from "./utils/constants.js";

const manager: ClusterManager = new ClusterManager("dist/launch.js", {
    totalShards: "auto",
    token: process.env.DISCORD_TOKEN,
    mode: "process",
    shardsPerClusters: 10
});

manager.on("clusterCreate", (cluster: Cluster) => {
    logger.info(`Cluster #${cluster.id} created.`);
});

manager.on("clusterReady", (cluster: Cluster) => {
    logger.info(`Cluster #${cluster.id} is ready.`);
});

manager.on("debug", (msg: string) => {
    if (IS_DEV) logger.debug(msg);
});

await manager.spawn({ timeout: -1 });