import { getModelForClass, modelOptions, prop, Severity } from "@typegoose/typegoose";
import { ClusterNodeOptions } from "lavaclient";

@modelOptions({
    options: {
        allowMixed: Severity.ALLOW
    }
})
export class NodeDataSchema {
    @prop()
    public data: ClusterNodeOptions[];
}

export const NodeData = getModelForClass(NodeDataSchema, {
    options: {
        customName: "nodeData"
    }
});