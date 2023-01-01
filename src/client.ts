import { Client, Collection } from "discord.js";
import { Command } from "./types/Command.js";
import { GATEWAY_INTENTS } from "./utils/constants.js";

declare module "discord.js" {
    export interface Client {
        commands: Collection<string, Command>
    }
}

export const client: Client = new Client({
    intents: GATEWAY_INTENTS
});

client.commands = new Collection();