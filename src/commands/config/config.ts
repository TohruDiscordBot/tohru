import fetch from "node-fetch";
import { ApplicationCommandOptionType, Attachment, Colors, CommandInteraction, PermissionFlagsBits } from "discord.js";
import { LevelingConfig } from "../../db/schemas/guild/LevelingConfig.js";
import { MODULE_OPTION } from "../../utils/constants.js";
import { checkJson, ConfigType, processJsonCfg } from "../../utils/jsonUtils.js";
import { registerCommand } from "../index.js";

registerCommand({
    name: "config",
    description: "⚙ Configures how Tohru works.",
    defaultMemberPermissions: PermissionFlagsBits.Administrator,
    options: [
        MODULE_OPTION,
        {
            name: "file",
            description: "📁 Config file.",
            type: ApplicationCommandOptionType.Attachment,
            required: true
        }
    ],
    ephemeral: true,
    async run(interaction: CommandInteraction): Promise<void> {
        const file: Attachment = interaction.options.get("file").attachment;

        const fileContent: any = await (await fetch(file.url, {
            method: "GET"
        })).text();

        if (!checkJson(fileContent)) {
            await interaction.editReply({
                options: {
                    ephemeral: true
                },
                embeds: [
                    {
                        color: Colors.Red,
                        description: "❌ Invalid file."
                    }
                ]
            });
            return;
        }

        const module: string = interaction.options.get("module").value as string;

        switch (module) {
            case "leveling":
                await LevelingConfig.findOneAndReplace(
                    { id: interaction.guildId },
                    processJsonCfg(fileContent, interaction.guildId, ConfigType.Leveling)
                );
                break;
            case "music":
                await LevelingConfig.findOneAndReplace(
                    { id: interaction.guildId },
                    processJsonCfg(fileContent, interaction.guildId, ConfigType.Music)
                );
                break;
        }

        await interaction.editReply({
            embeds: [
                {
                    color: Colors.Green,
                    description: `✅ Config for ${module} updated.`
                }
            ]
        });
    }
});