import { Guild } from "discord.js";
import { GuildConfigSchema } from "../db/schemas/GuildConfig";

export function defaultGuildSetting(guild: Guild): GuildConfigSchema {
    return {
        id: guild.id,
        leveling: {
            guild: guild.id,
            leaderboard: [],
            xpInterval: 60,
            minXp: 10,
            maxXp: 100,
            channel: null
        }
    };
}