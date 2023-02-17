(await import("@lavaclient/queue")).load();
import { Guild } from "discord.js";
import { Cluster, ClusterNode } from "lavaclient";
import { client } from "../client.js";
import { logger } from "../utils/logger.js";

// @ts-ignore
import nodes from "../../conf/nodes.json" assert { type: "json" };

export const cluster: Cluster = new Cluster({
    nodes,
    sendGatewayPayload: async (id: string, payload) => {
        const guild: Guild = await client.guilds.fetch(id);
        if (guild) guild.shard.send(payload, true);
    }
});

cluster.on("nodeConnect",
    (node: ClusterNode) => logger.info(`[LAVALINK] [SHARD #${client.shard.ids}] Node ${node.conn.info.host} connected.`)
);

cluster.on("nodeDisconnect",
    (node: ClusterNode) => logger.warn(`[LAVALINK] [SHARD #${client.shard.ids}] Node ${node.conn.info.host} disconnected.`)
);

cluster.on("nodeError",
    (node: ClusterNode) => logger.error(`[LAVALINK] [SHARD #${client.shard.ids}] Node ${node.conn.info.host} encountered an error.`)
);