import { Colors, CommandInteraction } from "discord.js";
import { Player } from "lavaclient";
import { cluster } from "../modules/music.js";
import { PreconditionResult } from "../types/Precondition.js";
import { registerPrecondition } from "./index.js";

registerPrecondition({
    name: "activeQueue",
    async run(interaction: CommandInteraction): Promise<PreconditionResult> {
        const player: Player = cluster.getPlayer(interaction.guildId);
        if (!player) {
            await interaction.editReply({
                embeds: [
                    {
                        color: Colors.Red,
                        description: "❌ There is no active player."
                    }
                ]
            });
            return PreconditionResult.Error;
        }

        if (!player.queue.tracks.length) {
            await interaction.editReply({
                embeds: [
                    {
                        color: Colors.Red,
                        description: "❌ There is no song in the queue."
                    }
                ]
            });
            return PreconditionResult.Error;
        }
        return PreconditionResult.Ok;
    }
});