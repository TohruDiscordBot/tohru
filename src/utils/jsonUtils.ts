import { defaultLevelingSetting } from "./defaultSettings.js";

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
    switch (cfgType) {
        case ConfigType.Leveling:
            cfg.id = guildId;
            return {
                ...defaultLevelingSetting(guildId),
                ...cfg
            };
        default:
            return null;
    }
}

export enum ConfigType {
    Leveling
}