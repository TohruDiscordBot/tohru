import { getModelForClass, modelOptions, prop, Ref, Severity } from "@typegoose/typegoose";
import { defaultMusicSetting } from "../../utils/defaultSettings.js";

@modelOptions({
    options: {
        allowMixed: Severity.ALLOW
    }
})
export class MusicConfigSchema {
    @prop()
    public id: string

    @prop()
    public 247: boolean;
}

export const MusicConfig = getModelForClass(MusicConfigSchema, {
    options: {
        customName: "musicConfigs"
    }
});

export async function getMusicSettingFromDb(guildId: string): Promise<MusicConfigSchema> {
    let musicCfg: MusicConfigSchema = await MusicConfig.findOne({
        id: guildId
    });

    if (!musicCfg) {
        musicCfg = await MusicConfig.create(defaultMusicSetting(guildId));
    }

    return musicCfg;
}