import { LevelingConfigSchema } from "../db/schemas/guild/LevelingConfig.js";
import { MemberLevelingSchema } from "../db/schemas/member/MemberLeveling.js";
import { MusicConfigSchema } from "../db/schemas/guild/MusicConfig.js";

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
        level: 0
    };
}