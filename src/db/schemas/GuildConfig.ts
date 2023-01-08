import { getModelForClass, prop } from "@typegoose/typegoose";
import { LevelingConfigSchema } from "./LevelingConfig.js";

export class GuildConfigSchema {
    @prop({ required: true })
    public id: string;

    @prop()
    public leveling: LevelingConfigSchema
}

export const GuildConfig = getModelForClass(GuildConfigSchema);