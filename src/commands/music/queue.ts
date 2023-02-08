import moment from "moment";
import { Song } from "@lavaclient/queue";
import { ActionRowBuilder, ApplicationCommandOptionType, ButtonBuilder, ButtonInteraction, ButtonStyle, Colors, CommandInteraction, EmbedBuilder, GuildMember, Interaction } from "discord.js";
import { Player } from "lavaclient";
import { cluster } from "../../modules/Music.js";
import { registerButton, registerCommand } from "../index.js";
import { chunk } from "../../utils/arrayUtils.js";

let page: number = 0;
let queue: Song[];
let divQueue: Song[][];

const buttons: ButtonBuilder[] = [
    new ButtonBuilder()
        .setCustomId("q-prev")
        .setLabel("⬅")
        .setDisabled(true)
        .setStyle(ButtonStyle.Primary),
    new ButtonBuilder()
        .setCustomId("q-next")
        .setLabel("➡")
        .setStyle(ButtonStyle.Primary),
    new ButtonBuilder()
        .setCustomId("q-close")
        .setLabel("❌")
        .setStyle(ButtonStyle.Primary)
];

registerCommand({
    name: "queue",
    description: "❓ Views the queue.",
    options: [
        {
            name: "prev",
            description: "❓ Shows the previous queue",
            type: ApplicationCommandOptionType.Boolean,
            required: false
        }
    ],
    preconditions: ["activePlayer"],
    async run(interaction: CommandInteraction): Promise<void> {
        const player: Player = cluster.getPlayer(interaction.guildId);
        const isPrev: boolean = interaction.options.get("prev") ? interaction.options.get("prev").value as boolean : false;

        const { queue: { tracks, previous } } = player;

        if (isPrev && !previous.length) {
            await interaction.editReply({
                embeds: [
                    {
                        color: Colors.Red,
                        description: "❌ There is no song in the queue."
                    }
                ]
            });
            return;
        }

        if (!isPrev && !tracks.length) {
            await interaction.editReply({
                embeds: [
                    {
                        color: Colors.Red,
                        description: "❌ There is no song in the queue."
                    }
                ]
            });
            return;
        }
        queue = isPrev ? previous : tracks;
        divQueue = chunk(queue, 5);
        await render(interaction);
    }
});

registerButton("q-prev", async (interaction: ButtonInteraction) => {
    page--;
    if (page < 0) page = 0;
    await render(interaction);
});

registerButton("q-prev", async (interaction: ButtonInteraction) => {
    page++;
    if (page >= divQueue.length) page = 0;
    await render(interaction);
});

registerButton("q-close", async (interaction: ButtonInteraction) => {
    try {
        await interaction.deleteReply();
    } catch (ignored: any) { }
});

async function createEmbed(interaction: CommandInteraction | ButtonInteraction): Promise<EmbedBuilder> {
    if (!queue || !divQueue) return null;
    if (page >= divQueue.length) page = 0;

    const embed: EmbedBuilder = new EmbedBuilder()
        .setAuthor({
            name: interaction.guild.name,
            iconURL: interaction.guild.iconURL({ extension: "png", forceStatic: false })
        })
        .setTitle("Queue")
        .setDescription("Tracks will be played in decending order")
        .setFooter({
            text: `Page ${page + 1}/${divQueue.length}`
        });

    const selected: Song[] = divQueue[page];

    for (const song of selected) {
        const member: GuildMember = await interaction.guild.members.fetch(song.requester);
        embed.addFields(
            {
                name: `${queue.indexOf(song) + 1}. **${song.title}**\n${song.uri}`,
                value: `➡ Uploader: ${song.author} | Requester: ${member.user.tag} | Length: ${moment.utc(song.length).format("HH:mm:ss")}`
            }
        );
    }

    return embed;
}

async function render(interaction: CommandInteraction | ButtonInteraction): Promise<void> {
    const embed: EmbedBuilder = await createEmbed(interaction);
    if (!embed) return;

    buttons[0].setDisabled(divQueue.length === 1);
    buttons[1].setDisabled(page === divQueue.length - 1);

    await interaction.editReply({
        embeds: [embed],
        components: [
            // @ts-ignore
            new ActionRowBuilder()
                .setComponents(buttons)
        ]
    });
}
