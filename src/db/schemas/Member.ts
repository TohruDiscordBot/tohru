import { prop, getModelForClass, Ref, DocumentType } from "@typegoose/typegoose";
import { GuildConfigSchema } from "./GuildConfig.js";

export class MemberSchema {
    @prop({ required: true })
    public id: string;

    @prop({ ref: () => GuildConfigSchema })
    public guild: Ref<GuildConfigSchema>;

    @prop()
    public exp: number;

    @prop()
    public level: number;
}

export const Member = getModelForClass(MemberSchema);