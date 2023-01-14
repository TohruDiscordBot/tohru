import { Guild } from "discord.js";
import { client } from "../../client.js";
import { GuildConfig } from "../../db/schemas/GuildConfig";
import { defaultGuildSetting } from "../../utils/defaultSettings.js";

client.on("guildCreate", async (guild: Guild) => {
    if (!(await GuildConfig.findOne({ id: guild.id })))
        await GuildConfig.create(defaultGuildSetting(guild.id));
});