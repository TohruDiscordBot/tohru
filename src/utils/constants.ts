(await import("dotenv")).config();
import { ApplicationCommandOption, ApplicationCommandOptionType, GatewayIntentBits, IntentsBitField } from "discord.js";

export const GATEWAY_INTENTS: GatewayIntentBits[] = [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildPresences,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent
];

export const MODULE_OPTION: ApplicationCommandOption = {
    name: "module",
    description: "📰 Name of the module.",
    type: ApplicationCommandOptionType.String,
    required: true,
    choices: [
        {
            name: "Leveling",
            value: "leveling"
        }
    ]
}

export const ENV: string = process.env.NODE_ENV.toLowerCase();