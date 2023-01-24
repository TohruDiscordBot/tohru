import { client } from "../../client.js";
import { cluster } from "../../modules/Music.js";
import { logger } from "../../utils/logger.js";
import { updateCommands } from "../../utils/updateCommands.js";

client.on("ready", () => {
    if (client.shard.ids.length === 1) {
        updateCommands();
    }

    cluster.connect(client.user.id);

    logger.info(`[READY] [SHARD #${client.shard.ids}] Logged in as ${client.user.tag}.`);
});