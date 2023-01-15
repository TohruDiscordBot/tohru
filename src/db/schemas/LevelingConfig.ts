import { modelOptions, prop, Ref, Severity } from "@typegoose/typegoose";
import { GuildConfigSchema } from "./GuildConfig.js";

@modelOptions({
    options: {
        allowMixed: Severity.ALLOW
    }
})
export class LevelingConfigSchema {
    @prop({ ref: () => GuildConfigSchema, type: () => String })
    public guild: Ref<GuildConfigSchema, string>

    @prop()
    public leaderboard: string[];

    @prop()
    public xpInterval: number;

    @prop()
    public minXp: number;

    @prop()
    public maxXp: number;

    @prop()
    public allowedChannels: string[]

    @prop()
    public restrictedChannels: string[]
}