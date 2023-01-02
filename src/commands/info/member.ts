import { ApplicationCommandOptionType, CommandInteraction, EmbedBuilder, GuildMember, PermissionFlagsBits } from "discord.js";
import { registerCommand } from "../index.js";

registerCommand({
    name: "member",
    description: "🤓 Show member information.",
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

        const embed: EmbedBuilder = new EmbedBuilder()
            .setAuthor({
                iconURL: member.user.avatarURL({ extension: "png", forceStatic: false }),
                name: member.user.tag
            })
            .setTitle("📝 Member Info")
            .setDescription(`🕹 Joined Since: ${member.joinedAt.toLocaleString()}`)
            .setThumbnail(member.user.avatarURL({ extension: "png", forceStatic: false }))
            .addFields(
                {
                    name: "👤 Username",
                    value: member.user.username,
                    inline: true
                },
                {
                    name: "🔢 Discriminator",
                    value: member.user.discriminator,
                    inline: true
                },
                {
                    name: "🤵 Manager",
                    value: member.permissions.has(PermissionFlagsBits.ManageGuild) ? "Yes" : "No",
                    inline: true
                },
                {
                    name: "🍥 Highest Role",
                    value: `@${member.roles.highest.name}`,
                    inline: true
                },
                {
                    name: "❌ Timed out",
                    value: member.isCommunicationDisabled() ? "Yes" : "No",
                    inline: true
                },
                {
                    name: "⏱ Timed out until",
                    value: member.communicationDisabledUntil ? member.communicationDisabledUntil.toLocaleString() : "No",
                    inline: true
                }
            );

        await interaction.editReply({
            embeds: [
                embed
            ]
        });
    }
});