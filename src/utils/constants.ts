import { GatewayIntentBits, IntentsBitField } from "discord.js";

export const GATEWAY_INTENTS: GatewayIntentBits[] = [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers
];