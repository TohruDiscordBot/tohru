import { ButtonInteraction, Interaction } from "discord.js";
import { client } from "../../client.js";
import { Button } from "../../types/Button.js";
import { logger } from "../../utils/logger.js";

client.on("interactionCreate", async (interaction: Interaction) => {
    if (interaction instanceof ButtonInteraction) {
        await interaction.deferUpdate();
        logger.info(`[INTERACTION] User ${interaction.user.id} at guild ${interaction.guildId} requested button ${interaction.customId}.`);

        const button: Button = client.buttons.get(interaction.customId);

        if (!button) {
            logger.warn(`[INTERACTION] Button ${interaction.customId} not found. Cancelling...`);
            return;
        }

        try {
            await button.run(interaction);
            logger.info(`[INTERACTION] Button ${interaction.customId} executed.`);
            logger.debug(`[INTERACTION] Interaction ID: ${interaction.id}.`);
            logger.debug(`[INTERACTION] Interaction token: ${interaction.token}.`);
        } catch (e: any) {
            logger.warn(`[INTERACTION] Button ${interaction.customId} executed with errors.`)
            logger.error(`[INTERACTION]` + e);
        }
    }
});