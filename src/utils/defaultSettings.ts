import { Guild } from "discord.js";
import { GuildConfigSchema } from "../db/schemas/GuildConfig";

export function defaultGuildSetting(id: string): GuildConfigSchema {
    return {
        id,
        leveling: {
            guild: id,
            leaderboard: [],
            xpInterval: 60,
            minXp: 10,
            maxXp: 100,
            allowedChannels: [],
            restrictedChannels: []
        }
    };
}