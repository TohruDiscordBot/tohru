import { CommandInteraction, Interaction } from "discord.js";
import { client } from "../../client.js";
import { Command } from "../../types/Command.js";
import { logger } from "../../utils/logger.js";

client.on("interactionCreate", async (interaction: Interaction) => {
    if (interaction instanceof CommandInteraction) {
        await interaction.deferReply();
        logger.info(`[INTERACTION] User ${interaction.user.id} at guild ${interaction.guildId} requested command ${interaction.commandName}.`);
        const command: Command = client.commands.get(interaction.commandName);

        if (!command) {
            logger.warn(`[INTERACTION] Command ${interaction.commandName} not found to serve user ${interaction.user.id} at guild ${interaction.guildId} requested command name.`);
            return;
        }

        try {
            await command.run(interaction);
            logger.info(`[INTERACTION] ${interaction.user.id} at guild ${interaction.guildId} executed command ${interaction.commandName}.`);
            logger.debug(`[INTERACTION] Interaction ID: ${interaction.id}.`);
            logger.debug(`[INTERACTION] Interaction token: ${interaction.token}.`);
        } catch (e: any) {
            logger.warn(`[INTERACTION] ${interaction.user.id} at guild ${interaction.guildId} executed command ${interaction.commandName} with errors.`)
            logger.error(e);
        }
    }
});