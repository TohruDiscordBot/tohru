import { CommandInteraction, ApplicationCommandOptionType, GuildMember, Colors } from "discord.js";
import { Member, MemberSchema } from "../../db/schemas/Member.js";
import { registerCommand } from "../index.js";

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

        await interaction.editReply({
            embeds: [
                {
                    color: Colors.Blue,
                    title: "Level",
                    description: `${member.user.tag}'s level is ${levelMem.level}`,
                    footer: {
                        text: `nexp until next level`
                    }
                }
            ]
        });
    }
});