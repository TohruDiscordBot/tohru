import { getModelForClass, modelOptions, prop, Ref, Severity } from "@typegoose/typegoose";
import { defaultMusicSetting } from "../../../utils/defaultSettings.js";
import { ConfigType, processJsonCfg } from "../../../utils/jsonUtils.js";

@modelOptions({
    options: {
        allowMixed: Severity.ALLOW
    }
})
export class MusicConfigSchema {
    @prop()
    public id: string;

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
    } else
        musicCfg = await MusicConfig.findOneAndReplace(
            { id: guildId },
            processJsonCfg(
                JSON.stringify(musicCfg),
                guildId,
                ConfigType.Music
            )
        );

    return musicCfg;
}