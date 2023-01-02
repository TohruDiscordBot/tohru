import { CommandInteraction } from "discord.js";

export interface Precondition {
    name: string,
    run(interaction: CommandInteraction): Promise<PreconditionResult>
}

export enum PreconditionResult {
    Ok,
    Error
}