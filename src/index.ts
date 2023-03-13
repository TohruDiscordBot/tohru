(await import("dotenv")).config();
import { logger } from "./utils/logger.js";
import { Cluster, ClusterManager } from "discord-hybrid-sharding";
import { IS_DEV } from "./utils/constants.js";
import Bridge from "discord-cross-hosting";

const client: Bridge.Client = new Bridge.Client({
    agent: "bot",
    host: process.env.HOST,
    port: Number(process.env.PORT),
    authToken: process.env.AUTH_TOKEN,
    rollingRestarts: true,
    tls: true,
    options: {
        pskCallback: () => {
            return {
                psk: Buffer.from(process.env.PASSWORD),
                identity: process.env.IDENTITY
            };
        },
        ciphers: "PSK",
        checkServerIdentity: () => void 0
    }
});

client.on("debug", (msg: string) => {
    if (IS_DEV) logger.debug(msg);
});

client.on("ready", () => {
    logger.info("Bridge connected.");
});

await client.connect();

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

client.listen(manager);
client.requestShardData().then((e) => {
    if (!e) return;
    if (!e.shardList) return;
    manager.totalShards = e.totalShards;
    manager.totalClusters = e.shardList.length;
    // @ts-ignore
    manager.shardList = e.shardList;
    manager.clusterList = e.clusterList;
    manager.spawn({ timeout: -1 });
});