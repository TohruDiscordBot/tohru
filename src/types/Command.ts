import { ChatInputApplicationCommandData, CommandInteraction } from "discord.js";

export interface Command extends ChatInputApplicationCommandData {
    preconditions?: string[],
    run(interaction: CommandInteraction): Promise<void>
};