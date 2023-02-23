import { Colors, CommandInteraction, PermissionFlagsBits } from "discord.js";
import { MemberLeveling } from "../../db/schemas/member/MemberLeveling.js";
import { registerCommand } from "../index.js";

registerCommand({
    name: "resetlb",
    description: "⚙ Reset the leaderboard.",
    defaultMemberPermissions: PermissionFlagsBits.Administrator,
    async run(interaction: CommandInteraction): Promise<void> {
        while ((await MemberLeveling.find({ guild: interaction.guildId })).length) {
            await MemberLeveling.findOneAndDelete({ guild: interaction.guildId });
        }

        await interaction.editReply({
            embeds: [
                {
                    color: Colors.Green,
                    description: "✅ Successfully reset the leaderboard."
                }
            ]
        });
    }
});