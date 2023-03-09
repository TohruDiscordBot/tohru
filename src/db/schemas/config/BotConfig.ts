import { getModelForClass, modelOptions, prop, Severity } from "@typegoose/typegoose";

@modelOptions({
    options: {
        allowMixed: Severity.ALLOW
    }
})
export class BotConfigSchema {
    @prop()
    public modules: {
        leveling: true,
        music: true
    };

    @prop()
    public owners: string[];
}

export const BotConfig = getModelForClass(BotConfigSchema, {
    options: {
        customName: "botConfig"
    }
});