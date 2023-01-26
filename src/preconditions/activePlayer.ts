import { Colors, CommandInteraction } from "discord.js";
import { Player } from "lavaclient";
import { cluster } from "../modules/Music.js";
import { PreconditionResult } from "../types/Precondition.js";
import { registerPrecondition } from "./index.js";

registerPrecondition({
    name: "activePlayer",
    async run(interaction: CommandInteraction): Promise<PreconditionResult> {
        const player: Player = cluster.getPlayer(interaction.guildId);
        if (!player || !player.trackData) {
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
        return PreconditionResult.Ok;
    }
});