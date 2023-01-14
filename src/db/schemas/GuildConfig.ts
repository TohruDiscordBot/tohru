import { getModelForClass, prop } from "@typegoose/typegoose";
import { defaultGuildSetting } from "../../utils/defaultSettings.js";
import { LevelingConfigSchema } from "./LevelingConfig.js";

export class GuildConfigSchema {
    @prop({ required: true })
    public id: string;

    @prop()
    public leveling: LevelingConfigSchema
}

export const GuildConfig = getModelForClass(GuildConfigSchema);

export async function getGuildFromDb(guildId: string): Promise<GuildConfigSchema> {
    let guildConfig: GuildConfigSchema = await GuildConfig.findOne({
        id: guildId
    });

    if (!guildConfig) {
        guildConfig = await GuildConfig.create(defaultGuildSetting(guildId));
    }

    return guildConfig;
}