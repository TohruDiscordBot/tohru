import { GuildConfigSchema } from "../db/schemas/GuildConfig.js";
import { LevelingConfigSchema } from "../db/schemas/LevelingConfig.js";
import { MemberLevelingSchema } from "../db/schemas/MemberLeveling.js";
import { MusicConfigSchema } from "../db/schemas/MusicConfig.js";

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

export function defaultMusicSetting(id: string): MusicConfigSchema {
    return {
        id,
        247: false
    };
}

export function defaultMemberLevelingSetting(id: string, guildId: string): MemberLevelingSchema {
    return {
        id,
        guild: guildId,
        exp: 0,
        level: 0,
        rank: 0
    };
}