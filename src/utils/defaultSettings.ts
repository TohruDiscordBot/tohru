import { GuildConfigSchema } from "../db/schemas/GuildConfig.js";
import { LevelingConfigSchema } from "../db/schemas/LevelingConfig.js";

export function defaultGuildSetting(id: string): GuildConfigSchema {
    return {
        id,
        leveling: id
    };
}

export function defaultLevelingSetting(id: string): LevelingConfigSchema {
    return {
        id,
        enable: false,
        xpInterval: 60,
        minXp: 10,
        maxXp: 100,
        allowedChannels: [],
        restrictedChannels: []
    };
}