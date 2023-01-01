import { Colors, CommandInteraction } from "discord.js";
import { client } from "../../client.js";
import { registerCommand } from "../index.js";

registerCommand({
    name: "ping",
    description: "🏓 Show the ping between the bot and the server.",
    async run(interaction: CommandInteraction): Promise<void> {
        await interaction.editReply({
            embeds: [
                {
                    color: Colors.Red,
                    description: `🏓 It took me ${client.ws.ping}ms to fly from my house to here.`
                }
            ]
        });
    }
});