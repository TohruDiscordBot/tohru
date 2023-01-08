import { prop, Ref } from "@typegoose/typegoose";
import { GuildConfigSchema } from "./GuildConfig.js";

export class LevelingConfigSchema {
    @prop({ ref: () => GuildConfigSchema })
    public guild: Ref<GuildConfigSchema>

    @prop()
    public leaderboard: string[];

    @prop()
    public xpInterval: number;

    @prop()
    public minXp: number;

    @prop()
    public maxXp: number;
}