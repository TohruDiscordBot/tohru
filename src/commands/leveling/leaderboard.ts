import { EmbedBuilder } from "@discordjs/builders";
import { CommandInteraction, GuildMember } from "discord.js";
import { Member, MemberSchema } from "../../db/schemas/Member.js";
import { registerCommand } from "../index.js";

registerCommand({
    name: "leaderboard",
    description: "➕ Shows the leveling leaderboard.",
    async run(interaction: CommandInteraction): Promise<void> {
        const leaderboard: MemberSchema[] = (await Member.find({ guild: interaction.guildId }))
            .sort((a: MemberSchema, b: MemberSchema) => {
                return b.exp - a.exp;
            }).slice(0, 9);

        const embed: EmbedBuilder = new EmbedBuilder()
            .setTitle("Leveling Leaderboard")
            .setAuthor({
                name: interaction.guild.name,
                iconURL: interaction.guild.iconURL({ extension: "png", forceStatic: false }),
                url: null
            });

        for (const val of leaderboard) {
            const member: GuildMember = await interaction.guild.members.fetch(val.id);
            embed.addFields({
                name: `#${leaderboard.indexOf(val) + 1} ${member.user.tag}`,
                value: `Exp: ${val.exp} | Level: ${val.level}`,
                inline: false
            });
        }

        await interaction.editReply({
            embeds: [embed]
        });
    }
});