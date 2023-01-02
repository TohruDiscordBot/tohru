import { CommandInteraction, Interaction } from "discord.js";
import { client } from "../../client.js";
import { Command } from "../../types/Command.js";
import { Precondition, PreconditionResult } from "../../types/Precondition.js";
import { logger } from "../../utils/logger.js";

client.on("interactionCreate", async (interaction: Interaction) => {
    if (interaction instanceof CommandInteraction) {
        await interaction.deferReply();
        logger.info(`[INTERACTION] User ${interaction.user.id} at guild ${interaction.guildId} requested command ${interaction.commandName}.`);
        const command: Command = client.commands.get(interaction.commandName);

        if (!command) {
            logger.warn(`[INTERACTION] Command ${interaction.commandName} not found. Cancelling...`);
            return;
        }

        if (command.preconditions) {
            logger.info(`[INTERACTION] Checking preconditions for command ${interaction.commandName}.`);
            for (const name of command.preconditions) {
                const precondition: Precondition = client.preconditions.get(name);
                if (!precondition) {
                    logger.warn(`[INTERACTION] Precondition ${name} not found. Cancelling...`);
                    return;
                }

                if (await precondition.run(interaction) === PreconditionResult.Error) {
                    logger.warn(`[INTERACTION] Precondition ${name} returned false. Cancelling...`);
                    return;
                }
            }
        }

        try {
            await command.run(interaction);
            logger.info(`[INTERACTION] Command ${interaction.commandName} executed.`);
            logger.debug(`[INTERACTION] Interaction ID: ${interaction.id}.`);
            logger.debug(`[INTERACTION] Interaction token: ${interaction.token}.`);
        } catch (e: any) {
            logger.warn(`[INTERACTION] Command ${interaction.commandName} executed with errors.`)
            logger.error(`[INTERACTION] ` + e);
        }
    }
});