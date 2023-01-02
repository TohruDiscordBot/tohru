import { Client, Collection } from "discord.js";
import { Button } from "./types/Button.js";
import { Command } from "./types/Command.js";
import { Precondition } from "./types/Precondition.js";
import { GATEWAY_INTENTS } from "./utils/constants.js";

declare module "discord.js" {
    export interface Client {
        commands: Collection<string, Command>,
        preconditions: Collection<string, Precondition>,
        buttons: Collection<string, Button>
    }
}

export const client: Client = new Client({
    intents: GATEWAY_INTENTS,
    sweepers: {
        messages: {
            lifetime: 21600,
            interval: 43200
        }
    }
});


client.commands = new Collection();
client.preconditions = new Collection();
client.buttons = new Collection();