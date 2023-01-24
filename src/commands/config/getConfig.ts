import { CommandInteraction, PermissionFlagsBits } from "discord.js";
import { getGuildLevelingSettingFromDb } from "../../db/schemas/LevelingConfig.js";
import { MODULE_OPTION } from "../../utils/constants.js";
import { registerCommand } from "../index.js";

registerCommand({
    name: "getconfig",
    description: "⚙ Gives the configuration of the chosen module.",
    defaultMemberPermissions: PermissionFlagsBits.Administrator,
    ephemeral: true,
    options: [MODULE_OPTION],
    async run(interaction: CommandInteraction): Promise<void> {
        let cfg: any = {};

        const module: string = interaction.options.get("module").value as string;

        switch (module) {
            case "leveling":
                cfg = await getGuildLevelingSettingFromDb(interaction.guildId);
                break;
        }

        await interaction.editReply({
            options: {
                ephemeral: true
            },
            content: `\`\`\`json\n${JSON.stringify(cfg, null, 4)}\n\`\`\``
        });
    }
});