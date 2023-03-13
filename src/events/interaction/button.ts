import { ButtonInteraction, Interaction } from "discord.js";
import { client } from "../../client.js";
import { logger } from "../../utils/logger.js";

client.on("interactionCreate", async (interaction: Interaction) => {
    if (interaction instanceof ButtonInteraction) {
        await interaction.deferUpdate();
        logger.info(`User ${interaction.user.id} at guild ${interaction.guildId} requested button ${interaction.customId}.`);

        const button = client.buttons.get(interaction.customId);

        if (!button) {
            logger.warn(`Button ${interaction.customId} not found. Cancelling...`);
            return;
        }

        if (interaction.message.createdAt.getTime() < client.readyAt.getTime()) {
            logger.warn(`Button ${interaction.customId} attached to an unknown message. Cancelling...`);
            return;
        }

        try {
            await button(interaction);
            logger.info(`Button ${interaction.customId} executed.`);
            logger.debug(`Interaction ID: ${interaction.id}.`);
            logger.debug(`Interaction token: ${interaction.token}.`);
        } catch (e: any) {
            logger.warn(`Button ${interaction.customId} executed with errors.`)
            logger.error(e);
        }
    }
});