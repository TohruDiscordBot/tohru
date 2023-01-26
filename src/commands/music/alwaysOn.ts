import { Colors, CommandInteraction } from "discord.js";
import { getMusicSettingFromDb, MusicConfig, MusicConfigSchema } from "../../db/schemas/MusicConfig.js";
import { registerCommand } from "../index.js";

registerCommand({
    name: "alwayson",
    description: "🟢 Makes Tohru sing endlessly.",
    async run(interaction: CommandInteraction): Promise<void> {
        const alwaysOn: boolean = !(await getMusicSettingFromDb(interaction.guildId))[247];

        await MusicConfig.findByIdAndUpdate(
            { id: interaction.guildId },
            {
                $set: {
                    247: alwaysOn
                }
            }
        );

        await interaction.editReply({
            embeds: [
                {
                    color: Colors.Green,
                    description: `✅ ${alwaysOn ? "Enabled" : "Disabled"} 24/7 music playing.`
                }
            ]
        });
    }
});