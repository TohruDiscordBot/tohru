import { client } from "../client.js";
import { Command } from "../types/Command.js";

export function registerCommand(command: Command): void {
    client.commands.set(command.name, command);
}