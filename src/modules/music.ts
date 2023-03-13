(await import("@lavaclient/queue")).load();
import { Guild } from "discord.js";
import { Cluster, ClusterNode } from "lavaclient";
import { client } from "../client.js";
import { NodeData, NodeDataSchema } from "../db/schemas/config/NodeData.js";
import { logger } from "../utils/logger.js";

const nodes: NodeDataSchema = await NodeData.findOne();

export const cluster: Cluster = new Cluster({
    nodes: nodes.data,
    sendGatewayPayload: async (id: string, payload) => {
        const guild: Guild = await client.guilds.fetch(id);
        if (guild) guild.shard.send(payload, true);
    }
});

cluster.on("nodeConnect",
    (node: ClusterNode) => logger.info(`Node ${node.conn.info.host} connected.`)
);

cluster.on("nodeDisconnect",
    (node: ClusterNode) => logger.warn(`Node ${node.conn.info.host} disconnected.`)
);

cluster.on("nodeError",
    (node: ClusterNode) => logger.error(`Node ${node.conn.info.host} encountered an error.`)
);