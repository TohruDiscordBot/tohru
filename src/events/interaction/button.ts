import { ButtonInteraction, Interaction } from "discord.js";
import { client } from "../../client.js";
import { logger } from "../../utils/logger.js";

client.on("interactionCreate", async (interaction: Interaction) => {
    if (interaction instanceof ButtonInteraction) {
        await interaction.deferUpdate();
        logger.info(`[INTERACTION] [SHARD #${interaction.guild.shard.id}] User ${interaction.user.id} at guild ${interaction.guildId} requested button ${interaction.customId}.`);

        const button = client.buttons.get(interaction.customId);

        if (!button) {
            logger.warn(`[INTERACTION] [SHARD #${interaction.guild.shard.id}] Button ${interaction.customId} not found. Cancelling...`);
            return;
        }

        if (interaction.message.createdAt.getTime() < client.readyAt.getTime()) {
            logger.warn(`[INTERACTION] [SHARD #${interaction.guild.shard.id}] Button ${interaction.customId} attached to an unknown message. Cancelling...`);
            return;
        }

        try {
            await button(interaction);
            logger.info(`[INTERACTION] [SHARD #${interaction.guild.shard.id}] Button ${interaction.customId} executed.`);
            logger.debug(`[INTERACTION] [SHARD #${interaction.guild.shard.id}] Interaction ID: ${interaction.id}.`);
            logger.debug(`[INTERACTION] [SHARD #${interaction.guild.shard.id}] Interaction token: ${interaction.token}.`);
        } catch (e: any) {
            logger.warn(`[INTERACTION] [SHARD #${interaction.guild.shard.id}] Button ${interaction.customId} executed with errors.`)
            logger.error(`[INTERACTION] [SHARD #${interaction.guild.shard.id}] ` + e);
        }
    }
});