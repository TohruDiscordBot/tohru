import { ApplicationCommandOptionType, Colors, CommandInteraction } from "discord.js";
import { Player } from "lavaclient";
import { cluster } from "../../modules/music.js";
import { registerCommand } from "../index.js";

registerCommand({
    name: "seek",
    description: "⏩ Seeks to a specified duration of the track in hh:mm:ss format.",
    preconditions: ["activePlayer"],
    options: [
        {
            name: "duration",
            description: "🕕 The point to seek to.",
            type: ApplicationCommandOptionType.String,
            required: true
        }
    ],
    async run(interaction: CommandInteraction): Promise<void> {
        const player: Player = cluster.getPlayer(interaction.guildId);
        const duration: string = interaction.options.get("duration").value as string;
        const posToSeek: number = convertDurationtoMs(duration);

        if (posToSeek < 0 || posToSeek > player.queue.current.length) {
            await interaction.editReply({
                embeds: [
                    {
                        color: Colors.Red,
                        description: `❌ Invalid time.`
                    }
                ]
            });
            return;
        }

        await player.seek(posToSeek);

        await interaction.editReply({
            embeds: [
                {
                    color: Colors.Green,
                    description: `✅ Seeked to ${duration}.`
                }
            ]
        });
    }
});

function convertDurationtoMs(duration: string): number {
    const [s, m, h] = duration.split(":").reverse();
    return 1000 * (Number(s) + (Number(m ?? 0) * 60) + (Number(h ?? 0) * 60));
}