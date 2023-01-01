import { client } from "../client.js";
import { Command } from "../types/Command.js";
import { logger } from "./logger.js";

export function updateCommands(): void {
    client.application.commands.cache.map(
        async (cmd) => await client.application.commands.delete(cmd)
    );

    logger.info(`[APPLICATION COMMAND] Pushing ${client.commands.size} command(s) to Discord.`);

    client.commands.map(
        async (cmd: Command) => await client.application.commands.create(cmd)
    );
}