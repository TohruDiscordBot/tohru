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

    public async setLevel(this: DocumentType<MemberSchema>, level: number): Promise<void> {
        this.level = level;
        await this.save();
    }

    public async setExp(this: DocumentType<MemberSchema>, exp: number): Promise<void> {
        this.exp = exp;
        await this.save();
    }
}

export const Member = getModelForClass(MemberSchema);