(await import("dotenv")).config();
import { ClusterClient, getInfo } from "discord-hybrid-sharding";
import Bridge from "discord-cross-hosting";
import { Client, Collection, Options } from "discord.js";
import { Command } from "./types/Command.js";
import { Precondition } from "./types/Precondition.js";
import { GATEWAY_INTENTS } from "./utils/constants.js";

declare module "discord.js" {
    export interface Client {
        commands: Collection<string, Command>,
        preconditions: Collection<string, Precondition>,
        buttons: Collection<string, (interaction: ButtonInteraction) => Promise<void>>,
        cluster: ClusterClient<Client>,
        machine: Bridge.Shard
    }
}

export const client: Client = new Client({
    intents: GATEWAY_INTENTS,
    sweepers: {
        ...Options.DefaultSweeperSettings,
        messages: {
            lifetime: 21600,
            interval: 43200
        }
    },
    makeCache: Options.cacheWithLimits({
        ...Options.DefaultMakeCacheSettings,
        MessageManager: 25,
        ReactionManager: 0
    }),
    shards: getInfo().SHARD_LIST,
    shardCount: getInfo().TOTAL_SHARDS
});

client.commands = new Collection();
client.preconditions = new Collection();
client.buttons = new Collection();
client.cluster = new ClusterClient(client);
client.machine = new Bridge.Shard(client.cluster);