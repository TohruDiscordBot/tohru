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

export const Member = getModelForClass(MemberSchema, {
    options: {
        customName: "members"
    }
});

export async function getMemberFromDb(id: string, guildId: string): Promise<MemberSchema> {
    let member: MemberSchema = await Member.findOne({
        id, guildId
    });

    if (!member) {
        member = await Member.create({
            id,
            guild: guildId,
            exp: 0,
            level: 0
        });
    }

    return member;
}