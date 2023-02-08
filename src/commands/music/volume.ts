import { ApplicationCommandOptionType, Colors, CommandInteraction } from "discord.js";
import { Player } from "lavaclient";
import { cluster } from "../../modules/Music.js";
import { registerCommand } from "../index.js";

registerCommand({
    name: "volume",
    description: "🔊 Controls the volume of Tohru.",
    preconditions: ["activeQueue"],
    options: [
        {
            name: "level",
            description: "🔢 Volume level.",
            type: ApplicationCommandOptionType.Number,
            minValue: 0,
            max_value: 200,
            required: false
        }
    ],
    async run(interaction: CommandInteraction): Promise<void> {
        const player: Player = cluster.getPlayer(interaction.guildId);

        const level: number = interaction.options.get("volume") ? interaction.options.get("volume").value as number : 100;

        await player.setVolume(level);

        await interaction.editReply({
            embeds: [
                {
                    color: Colors.Blue,
                    description: `✅ Successfully set the volume to ${level}%`
                }
            ]
        });
    }
});