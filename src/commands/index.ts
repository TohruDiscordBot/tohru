import { client } from "../client.js";
import { Command } from "../types/Command.js";

export function registerCommand(command: Command) {
    client.commands.set(command.name, command);
}