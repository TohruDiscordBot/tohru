import { Colors, CommandInteraction } from "discord.js";
import { Player } from "lavaclient";
import { cluster } from "../../modules/Music.js";
import { registerCommand } from "../index.js";

registerCommand({
    name: "nightcore",
    description: "🎞 Enable nightcore.",
    preconditions: ["activePlayer"],
    async run(interaction: CommandInteraction): Promise<void> {
        const player: Player = cluster.getPlayer(interaction.guildId);

        player.filters.timescale = (player.filterStatus.nightcore = !player.filterStatus.nightcore)
            ? { speed: 1.125, pitch: 1.125, rate: 1 }
            : undefined;

        await player.setFilters();

        await interaction.editReply({
            embeds: [
                {
                    color: Colors.Aqua,
                    description: `✅ ${player.filterStatus.nightcore ? "Enabled" : "Disabled"} nightcore.`
                }
            ]
        });


    }
});