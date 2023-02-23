import { getModelForClass, prop } from "@typegoose/typegoose";
import { defaultMemberLevelingSetting } from "../../../utils/defaultSettings.js";
import { processJsonMemberCfg } from "../../../utils/jsonUtils.js";

export class MemberLevelingSchema {
    @prop({ required: true })
    public id: string;

    @prop()
    public guild: string;

    @prop()
    public exp: number;

    @prop()
    public level: number;
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
    } else
        member = await MemberLeveling.findOneAndReplace(
            { id, guild: guildId },
            processJsonMemberCfg(
                JSON.stringify(member),
                id,
                guildId
            )
        );

    return member;
}