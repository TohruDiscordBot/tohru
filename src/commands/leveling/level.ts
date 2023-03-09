import { CommandInteraction, ApplicationCommandOptionType, GuildMember, Colors } from "discord.js";
import { LevelData } from "../../db/schemas/config/LevelData.js";
import { getMemberFromDb, MemberLevelingSchema } from "../../db/schemas/member/MemberLeveling.js";
import { registerCommand } from "../index.js";

const levelData = (await LevelData.findOne()).data;

registerCommand({
    name: "level",
    description: "🕹 Checks the level of a member.",
    options: [
        {
            name: "member",
            description: "👪 The member to check for information.",
            type: ApplicationCommandOptionType.User,
            required: false
        }
    ],
    async run(interaction: CommandInteraction): Promise<void> {
        let member: GuildMember;
        if (!interaction.options.get("member")) {
            member = await interaction.guild.members.fetch(interaction.user.id);
        } else member = interaction.options.getMember("member") as GuildMember;

        let levelMem: MemberLevelingSchema = await getMemberFromDb(member.id, interaction.guildId)

        let requiredExp: number = 0;

        for (const lvl of levelData) {
            if (lvl.level === levelMem.level + 1) {
                requiredExp = lvl.exp - levelMem.exp;
            }
        }

        await interaction.editReply({
            embeds: [
                {
                    color: Colors.Blue,
                    title: "Level",
                    description: `${member.user.tag}'s level is ${levelMem.level}`,
                    footer: {
                        text: requiredExp <= 0 ? "Maximum level reached" : `${requiredExp} exp until next level`
                    }
                }
            ]
        });
    }
});