import { getModelForClass, prop, DocumentType } from "@typegoose/typegoose";
import { Member, MemberSchema } from "./Member.js";

export class GuildConfigSchema {
    @prop({ required: true })
    public id: string;

    @prop({ type: () => [MemberSchema] })
    public leaderboard: MemberSchema[];

    @prop()
    public xpInterval: number;

    public async updateLb(collection: DocumentType<GuildConfigSchema>): Promise<void> {
        const memberList: MemberSchema[] = await Member.find({
            guild: this
        });
        memberList.sort((a: MemberSchema, b: MemberSchema) => b.level - a.level);
        this.leaderboard = memberList.slice(0, 4);
        await collection.save();
    }

    public async setXpInterval(this: DocumentType<GuildConfigSchema>, xpInterval: number): Promise<void> {
        this.xpInterval = xpInterval;
        await this.save();
    }
}

export const GuildConfig = getModelForClass(GuildConfigSchema);