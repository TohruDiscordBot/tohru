import { defaultLevelingSetting, defaultMemberLevelingSetting, defaultMusicSetting } from "./defaultSettings.js";

export function checkJson(jsonStr: any): boolean {
    try {
        JSON.parse(jsonStr);
    } catch (e: any) {
        return false;
    }
    return true;
}

export function processJsonCfg(cfg: any, guildId: string, cfgType: ConfigType): any {
    if (typeof cfg === "string") cfg = JSON.parse(cfg);
    else return null;
    cfg.id = guildId;
    switch (cfgType) {
        case ConfigType.Leveling:
            return {
                ...defaultLevelingSetting(guildId),
                ...cfg
            };
        case ConfigType.Music:
            return {
                ...defaultMusicSetting(guildId),
                ...cfg
            };
        default:
            return null;
    }
}

export function processJsonMemberCfg(cfg: any, userId: string, guildId: string): any {
    if (typeof cfg === "string") cfg = JSON.parse(cfg);
    else return null;
    cfg.id = userId;
    cfg.guild = guildId;
    return {
        ...defaultMemberLevelingSetting(userId, guildId),
        ...cfg
    };
}

export enum ConfigType {
    Leveling,
    Music
}