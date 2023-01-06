import { ApplicationCommandOptionType, CommandInteraction, GuildMember } from "discord.js";
import { registerCommand } from "../index.js";

registerCommand({
    name: "avatar",
    description: "😊 Get the avatar of a member.",
    options: [
        {
            name: "member",
            description: "👪 The member to get the avatar.",
            type: ApplicationCommandOptionType.User,
            required: false
        }
    ],
    async run(interaction: CommandInteraction): Promise<void> {
        let member: GuildMember;
        if (!interaction.options.get("member")) {
            member = await interaction.guild.members.fetch(interaction.user.id);
        } else member = interaction.options.getMember("member") as GuildMember;

        await interaction.editReply({
            embeds: [
                {
                    title: `${member.user.tag}'s avatar`,
                    image: {
                        url: member.user.avatarURL({ extension: "png", forceStatic: false })
                    }
                }
            ]
        });
    }
});