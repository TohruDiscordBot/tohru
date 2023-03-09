import { ActivityType } from "discord.js";
import { client } from "../../client.js";
import { BotConfig, BotConfigSchema } from "../../db/schemas/config/BotConfig.js";
import { cluster } from "../../modules/music.js";
import { logger } from "../../utils/logger.js";
import { getDuration } from "../../utils/timeUtils.js";
import { updateCommands } from "../../utils/updateCommands.js";

client.on("ready", async () => {
    if (client.shard.ids.length === 1) {
        await updateCommands();

        setInterval(() => {

            const uptime: Date = new Date(Date.now() - client.readyAt.getTime());

            client.user.setActivity({
                name: `Uptime: ${getDuration(uptime.getTime())}`,
                type: ActivityType.Playing
            })
        }, 10000);
    }

    const botConfig: BotConfigSchema = await BotConfig.findOne();

    if (botConfig.modules.music) cluster.connect(client.user.id);

    logger.info(`[READY] [SHARD #${client.shard.ids}] Logged in as ${client.user.tag}.`);
});