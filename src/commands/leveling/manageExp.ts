import { ApplicationCommandOptionType, Colors, CommandInteraction, GuildMember } from "discord.js";
import { getMemberFromDb, MemberSchema } from "../../db/schemas/Member.js";
import { setExp } from "../../modules/Leveling.js";
import { registerCommand } from "../index.js";

registerCommand({
    name: "manageexp",
    description: "⚙ Manage members' exp.",
    options: [
        {
            name: "member",
            description: "👪 The member to manage their exp.",
            type: ApplicationCommandOptionType.User,
            required: true
        },
        {
            name: "type",
            description: "❗ Type of operation to do.",
            type: ApplicationCommandOptionType.String,
            required: true,
            choices: [
                {
                    name: "add",
                    value: "add"
                },
                {
                    name: "remove",
                    value: "remove"
                },
                {
                    name: "set",
                    value: "set"
                }
            ]
        },
        {
            name: "value",
            description: "👛 The value of exp.",
            type: ApplicationCommandOptionType.Number,
            required: true
        }
    ],
    async run(interaction: CommandInteraction): Promise<void> {
        const member: GuildMember = await interaction.guild.members.fetch(interaction.options.get("member").user.id);
        const operation: string = interaction.options.get("type").value as string;

        const memData: MemberSchema = await getMemberFromDb(member.id, interaction.guildId);
        let val: number = interaction.options.get("value").value as number;

        switch (operation) {
            case "set":
                await setExp(member.id, interaction.guildId, val);
                await interaction.editReply({
                    embeds: [
                        {
                            color: Colors.Green,
                            description: `✅ Successfully set the exp of ${member.user.tag} to ${val}`
                        }
                    ]
                });
                break;
            case "add":
                val += memData.exp;
                await setExp(member.id, interaction.guildId, val);
                await interaction.editReply({
                    embeds: [
                        {
                            color: Colors.Green,
                            description: `✅ Successfully add ${val - memData.exp} exp to ${member.user.tag}`
                        }
                    ]
                });
                break;
            case "remove":
                val = -val + memData.exp;
                await setExp(member.id, interaction.guildId, val);
                await interaction.editReply({
                    embeds: [
                        {
                            color: Colors.Green,
                            description: `✅ Successfully remove ${memData.exp - val} exp to ${member.user.tag}`
                        }
                    ]
                });
                break;
        }
    }
});