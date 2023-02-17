import { Message } from "discord.js";
import { client } from "../../client.js";
import { handleLeveling } from "../../modules/leveling.js";

client.on("messageCreate", async (message: Message) => {
    if (message.author.bot || !message.guild) return;

    await handleLeveling(message);
});