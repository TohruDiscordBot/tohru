import { prop, getModelForClass, Ref } from "@typegoose/typegoose";
import { GuildConfigSchema } from "./GuildConfig.js";

export class MemberSchema {
    @prop({ required: true })
    public id: string;

    @prop({ ref: () => GuildConfigSchema, type: () => String })
    public guild: Ref<GuildConfigSchema, string>;

    @prop()
    public exp: number;

    @prop()
    public level: number;
}

export const Member = getModelForClass(MemberSchema);