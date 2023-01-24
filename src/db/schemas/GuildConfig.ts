import { getModelForClass, modelOptions, prop, Ref, Severity } from "@typegoose/typegoose";
import { defaultGuildSetting } from "../../utils/defaultSettings.js";
import { LevelingConfigSchema } from "./LevelingConfig.js";

@modelOptions({
    options: {
        allowMixed: Severity.ALLOW
    }
})
export class GuildConfigSchema {
    @prop({ required: true })
    public id: string;

    @prop()
    public leveling: Ref<LevelingConfigSchema, string>
}

export const GuildConfig = getModelForClass(GuildConfigSchema, {
    options: {
        customName: "guildConfigs"
    }
});

export async function getGuildFromDb(guildId: string): Promise<GuildConfigSchema> {
    let guildConfig: GuildConfigSchema = await GuildConfig.findOne({
        id: guildId
    });

    if (!guildConfig) {
        guildConfig = await GuildConfig.create(defaultGuildSetting(guildId));
    }

    return guildConfig;
}