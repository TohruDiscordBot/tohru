import { ChatInputApplicationCommandData, CommandInteraction } from "discord.js";

export interface Command extends ChatInputApplicationCommandData {
    preconditions?: string[],
    ephemeral?: boolean,
    run(interaction: CommandInteraction): Promise<void>
};