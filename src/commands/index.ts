import { ButtonInteraction } from "discord.js";
import { client } from "../client.js";
import { Command } from "../types/Command.js";

export function registerCommand(command: Command): void {
    client.commands.set(command.name, command);
}

export function registerButton(customId: string, exec: (interaction: ButtonInteraction) => Promise<void>): void {
    client.buttons.set(customId, exec);
}