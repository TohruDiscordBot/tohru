import { CommandInteraction, Interaction } from "discord.js";
import { client } from "../../client.js";
import { Command } from "../../types/Command.js";
import { Precondition, PreconditionResult } from "../../types/Precondition.js";
import { logger } from "../../utils/logger.js";


client.on("interactionCreate", async (interaction: Interaction) => {
    if (interaction instanceof CommandInteraction) {
        if (!interaction.inGuild) {
            logger.info(`User ${interaction.user.id} requested command ${interaction.commandName} in DM. Cancelling...`);
            return;
        }
        logger.info(`User ${interaction.user.id} at guild ${interaction.guildId} requested command ${interaction.commandName}.`);
        const command: Command = client.commands.get(interaction.commandName);

        if (!command) {
            logger.warn(`Command ${interaction.commandName} not found. Cancelling...`);
            return;
        }

        await interaction.deferReply({
            ephemeral: command.ephemeral ?? false
        });

        if (command.preconditions) {
            logger.info(`Checking preconditions for command ${interaction.commandName}.`);
            for (const name of command.preconditions) {
                const precondition: Precondition = client.preconditions.get(name);
                if (!precondition) {
                    logger.warn(`Precondition ${name} not found. Cancelling...`);
                    return;
                }

                if (await precondition.run(interaction) === PreconditionResult.Error) {
                    logger.warn(`Precondition ${name} returned false. Cancelling...`);
                    return;
                }
            }
        }

        try {
            await command.run(interaction);
            logger.info(`Command ${interaction.commandName} executed.`);
            logger.debug(`Interaction ID: ${interaction.id}.`);
            logger.debug(`Interaction token: ${interaction.token}.`);
        } catch (e: any) {
            logger.warn(`Command ${interaction.commandName} executed with errors.`)
            logger.error(e);
        }
    }
});