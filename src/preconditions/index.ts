import { client } from "../client.js";
import { Precondition } from "../types/Precondition.js";

export function registerPrecondition(precondition: Precondition): void {
    client.preconditions.set(precondition.name, precondition);
}