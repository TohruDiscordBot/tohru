import { ActivityType } from "discord.js";
import { NodeState } from "lavaclient";
import { client } from "../../client.js";
import { BotConfig, BotConfigSchema } from "../../db/schemas/config/BotConfig.js";
import { cluster } from "../../modules/music.js";
import { logger } from "../../utils/logger.js";
import { getDuration } from "../../utils/timeUtils.js";
import { updateCommands } from "../../utils/updateCommands.js";

client.on("ready", async () => {
    if (client.cluster.ids.length === 1) {
        await updateCommands();

        setInterval(() => {

            const uptime: Date = new Date(client.uptime);

            client.user.setActivity({
                name: `Uptime: ${getDuration(uptime.getTime())}`,
                type: ActivityType.Playing
            })
        }, 10000);

        setInterval(async () => {
            logger.info(`Performing nodes' checkup...`)
            for (const a of cluster.nodes.entries()) {
                if (a[1].state === NodeState.Disconnected)
                    await a[1].conn.reconnect();
            }
        }, 5 * 60 * 1000);
    }

    const botConfig: BotConfigSchema = await BotConfig.findOne();

    if (botConfig.modules.music) cluster.connect(client.user.id);

    logger.info(`Logged in as ${client.user.tag}.`);
});