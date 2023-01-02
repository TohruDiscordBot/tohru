(await import("dotenv")).config();
import { GatewayIntentBits, IntentsBitField } from "discord.js";

export const GATEWAY_INTENTS: GatewayIntentBits[] = [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildPresences,
    IntentsBitField.Flags.MessageContent
];

export const ENV: string = process.env.NODE_ENV;