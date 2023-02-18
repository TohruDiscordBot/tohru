(await import("dotenv")).config();
import { ApplicationCommandOption, ApplicationCommandOptionType, GatewayIntentBits, IntentsBitField } from "discord.js";

export const GATEWAY_INTENTS: GatewayIntentBits[] = [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildPresences,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
    IntentsBitField.Flags.GuildVoiceStates
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
        },
        {
            name: "Music",
            value: "music"
        }
    ]
}

export const YOUTUBE_URL_REGEX: RegExp = /^(?:(?:https|http):\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be).*(?<=\/|v\/|u\/|embed\/|shorts\/|watch\?v=)(?<!\/user\/)(?<id>[\w\-]{11})(?=\?|&|$)/;

export const IS_DEV: boolean = process.env.NODE_ENV.toLowerCase() === "dev";