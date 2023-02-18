import { getModelForClass, prop, Ref } from "@typegoose/typegoose";
import { defaultMemberLevelingSetting } from "../../utils/defaultSettings.js";
import { GuildConfigSchema } from "./GuildConfig.js";

export class MemberLevelingSchema {
    @prop({ required: true })
    public id: string;

    @prop({ ref: () => GuildConfigSchema, type: () => String })
    public guild: Ref<GuildConfigSchema, string>;

    @prop()
    public exp: number;

    @prop()
    public level: number;

    @prop()
    public rank: number;
}

export const MemberLeveling = getModelForClass(MemberLevelingSchema, {
    options: {
        customName: "memberLeveling"
    }
});

export async function getMemberFromDb(id: string, guildId: string): Promise<MemberLevelingSchema> {
    let member: MemberLevelingSchema = await MemberLeveling.findOne({
        id, guildId
    });

    if (!member) {
        member = await MemberLeveling.create(defaultMemberLevelingSetting(id, guildId));
    }

    return member;
}