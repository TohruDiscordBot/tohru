import moment from "moment";
import { Song } from "@lavaclient/queue";
import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, CommandInteraction, EmbedBuilder, Interaction } from "discord.js";
import { Player } from "lavaclient";
import { cluster } from "../../modules/Music.js";
import { registerButton, registerCommand } from "../index.js";

let page: number = 0;
let queue: Song[];
let divQueue: Song[][];

const buttons: ButtonBuilder[] = [
    new ButtonBuilder()
        .setCustomId("q-prev")
        .setLabel("Prev")
        .setDisabled(true)
        .setStyle(ButtonStyle.Primary),
    new ButtonBuilder()
        .setCustomId("q-next")
        .setLabel("Next")
        .setStyle(ButtonStyle.Primary),
    new ButtonBuilder()
        .setCustomId("q-close")
        .setLabel("Close")
        .setStyle(ButtonStyle.Primary)
];

registerCommand({
    name: "queue",
    description: "❓ Views the queue.",
    preconditions: ["activeQueue"],
    async run(interaction: CommandInteraction): Promise<void> {
        const player: Player = cluster.getPlayer(interaction.guildId);

        const { queue: { tracks } } = player;

        queue = tracks;

        const pagedQueue: Song[][] = chunk(tracks, 5);

        divQueue = pagedQueue;
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

function createEmbed(interaction: CommandInteraction | ButtonInteraction): EmbedBuilder {
    if (!queue || !divQueue) return null;
    if (page >= divQueue.length) page = 0;

    const embed: EmbedBuilder = new EmbedBuilder()
        .setAuthor({
            name: interaction.guild.name,
            iconURL: interaction.guild.iconURL({ extension: "png", forceStatic: false })
        })
        .setTitle("Queue")
        .setFooter({
            text: `Page 1/${divQueue.length}`
        });

    buttons[1].setDisabled(divQueue.length === 1);

    const selected: Song[] = divQueue[page];

    for (const song of selected) {
        embed.addFields(
            {
                name: `${queue.indexOf(song) + 1}. **${song.title}**\n${song.uri}`,
                value: `➡ Author: ${song.author} | Length: ${moment.utc(song.length).format("HH:mm:ss")}`
            }
        );
    }

    return embed;
}

async function render(interaction: CommandInteraction | ButtonInteraction): Promise<void> {
    const embed: EmbedBuilder = createEmbed(interaction);
    if (!embed) return;

    const row: ActionRowBuilder = new ActionRowBuilder()
        .setComponents(buttons);

    await interaction.editReply({
        embeds: [embed],
        components: [
            // @ts-ignore
            row
        ]
    });
}

function chunk(items: any[], size: number): any[][] {
    const chunks: any[][] = []
    items = [].concat(...items);

    while (items.length) {
        chunks.push(
            items.splice(0, size)
        );
    }

    return chunks;
}