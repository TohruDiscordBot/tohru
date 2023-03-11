import { Colors, CommandInteraction } from "discord.js";
import { updateCommands } from "../../utils/updateCommands.js";
import { registerCommand } from "../index.js";

registerCommand({
    name: "renewcommands",
    description: "🔃 Remove all commands and push them again to Discord.",
    preconditions: ["requireOwner"],
    async run(interaction: CommandInteraction): Promise<void> {
        try {
            await updateCommands();
            await interaction.editReply({
                embeds: [
                    {
                        color: Colors.Green,
                        description: "✅ All commands have been renewed."
                    }
                ]
            });
        } catch (e: any) {
            await interaction.editReply({
                embeds: [
                    {
                        color: Colors.Red,
                        description: "✅ An error occurred. Please try again later."
                    }
                ]
            });
        }
    }
});