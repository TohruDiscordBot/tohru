import { prop, Ref } from "@typegoose/typegoose";
import { GuildConfigSchema } from "./GuildConfig.js";
import { MemberSchema } from "./Member.js";

export class LevelingConfigSchema {
    @prop({ ref: () => GuildConfigSchema })
    public guild: Ref<GuildConfigSchema>

    @prop({ type: () => [MemberSchema] })
    public leaderboard: MemberSchema[];

    @prop()
    public xpInterval: number;

    @prop()
    public minXp: number;

    @prop()
    public maxXp: number;
}