import { GatewayDispatchEvents } from "discord.js";
import { client } from "../../client.js";
import { cluster } from "../../modules/Music.js";

client.ws.on(GatewayDispatchEvents.VoiceStateUpdate,
    async (data: any) => await cluster.handleVoiceUpdate(data)
);