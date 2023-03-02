import { ApplicationCommandOptionType, Colors, CommandInteraction } from "discord.js";
import { Player } from "lavaclient";
import { cluster } from "../../modules/music.js";
import { registerCommand } from "../index.js";

registerCommand({
    name: "remove",
    description: "❌ Removes songs from the queue.",
    preconditions: ["activeQueue"],
    options: [
        {
            name: "positions",
            description: "❓ Positions, separated with commas, of the songs to be removed.",
            type: ApplicationCommandOptionType.String,
            required: true
        },
        {
            name: "prev",
            description: "❓ Whether to delete tracks in previous queue or not.",
            type: ApplicationCommandOptionType.Boolean,
            required: false
        }
    ],
    async run(interaction: CommandInteraction): Promise<void> {
        const player: Player = cluster.getPlayer(interaction.guildId);
        const options: number[] = (interaction.options.get("positions").value as string)
            .replaceAll(" ", "").split(",").map((v: string) => {
                try {
                    return Number(v);
                } catch (e: any) { }
            });

        const prev: boolean = interaction.options.get("prev") ?
            interaction.options.get("prev").value as boolean :
            false;

        for (const i of options) {
            try {
                if (!prev) player.queue.tracks.splice(i - 1, 1);
                else player.prev.splice(i - 1, 1);
            } catch (e: any) { }
        }

        await interaction.editReply({
            embeds: [
                {
                    color: Colors.Green,
                    description: "✅ Deleted all requested songs."
                }
            ]
        });
    }
});