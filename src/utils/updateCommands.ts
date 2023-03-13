import { client } from "../client.js";
import { Command } from "../types/Command.js";
import { logger } from "./logger.js";

export async function updateCommands(): Promise<void> {
    logger.info(`Pushing ${client.commands.size} command(s) to Discord.`);

    await client.application.commands.set(client.commands.map((cmd: Command) => cmd));
}