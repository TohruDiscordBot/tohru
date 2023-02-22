import { getModelForClass, modelOptions, prop, Ref, Severity } from "@typegoose/typegoose";
import { Collection } from "discord.js";
import { defaultLevelingSetting } from "../../../utils/defaultSettings.js";
import { ConfigType, processJsonCfg } from "../../../utils/jsonUtils.js";

@modelOptions({
    options: {
        allowMixed: Severity.ALLOW
    }
})
export class LevelingConfigSchema {
    @prop()
    public id: string;

    @prop()
    public enable: boolean;

    @prop()
    public xpInterval: number;

    @prop()
    public minXp: number;

    @prop()
    public maxXp: number;

    @prop()
    public allowedChannels: string[];

    @prop()
    public restrictedChannels: string[];

    @prop()
    public reward: Collection<number, string>;
}

export const LevelingConfig = getModelForClass(LevelingConfigSchema, {
    options: {
        customName: "levelingConfigs"
    }
});

export async function getGuildLevelingSettingFromDb(guildId: string): Promise<LevelingConfigSchema> {
    let leveling: LevelingConfigSchema = await LevelingConfig.findOne({
        id: guildId
    });

    if (!leveling) {
        leveling = await LevelingConfig.create(defaultLevelingSetting(guildId));
    } else
        leveling = await LevelingConfig.findOneAndReplace(
            {
                id: guildId
            },
            processJsonCfg(
                JSON.stringify(leveling),
                guildId,
                ConfigType.Leveling
            )
        );

    return leveling;
}