import { CommandInteraction, ApplicationCommandOptionType, GuildMember, Colors } from "discord.js";
import { Member, MemberSchema } from "../../db/schemas/Member.js";
import { registerCommand } from "../index.js";

// @ts-ignore
import levelData from "../../../conf/levels.json" assert { type: "json" };

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

        let levelMem: MemberSchema = await Member.findOne({ id: member.user.id });

        if (!levelMem) {
            levelMem = {
                exp: 0,
                id: member.user.id,
                level: 0,
                guild: interaction.guildId
            }
            await Member.create(levelMem);
        }

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