import { Colors, CommandInteraction } from "discord.js";
import { client } from "../../client.js";
import { registerCommand } from "../index.js";

registerCommand({
    name: "ping",
    description: "🏓 Show the ping between Tohru and the server.",
    async run(interaction: CommandInteraction): Promise<void> {
        const ping: number = client.ws.shards.get(interaction.guild.shardId).ping;
        await interaction.editReply({
            embeds: [
                {
                    color: Colors.Red,
                    description: `🏓 It took me ${ping}ms to fly here from Kobayashi's house.`
                }
            ]
        });
    }
});