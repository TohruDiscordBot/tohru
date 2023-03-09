import { getModelForClass, modelOptions, prop, Severity } from "@typegoose/typegoose";

@modelOptions({
    options: {
        allowMixed: Severity.ALLOW
    }
})
export class LevelDataSchema {
    @prop()
    public data: { level: number, exp: number }[];
}

export const LevelData = getModelForClass(LevelDataSchema, {
    options: {
        customName: "levelData"
    }
});