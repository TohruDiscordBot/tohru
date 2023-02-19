import moment from "moment";
import { splitBar } from "string-progressbar";
import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, CommandInteraction, EmbedBuilder, GuildMember } from "discord.js";
import { registerButton, registerCommand } from "../index.js";
import { cluster } from "../../modules/music.js";
import { LoopType, Song } from "@lavaclient/queue";
import { Player } from "lavaclient";
import { getMusicSettingFromDb } from "../../db/schemas/guild/MusicConfig.js";

registerCommand({
    name: "controller",
    description: "🎮 Controls the player.",
    preconditions: ["activePlayer"],
    async run(interaction: CommandInteraction): Promise<void> {
        await render(interaction);
    }
});

const row1Buttons: ButtonBuilder[] = [
    new ButtonBuilder()
        .setCustomId("np-prev")
        .setLabel("⏮")
        .setStyle(ButtonStyle.Primary),
    new ButtonBuilder()
        .setCustomId("np-play")
        .setLabel("▶")
        .setStyle(ButtonStyle.Primary),
    new ButtonBuilder()
        .setCustomId("np-pause")
        .setLabel("⏸")
        .setStyle(ButtonStyle.Primary),
    new ButtonBuilder()
        .setCustomId("np-next")
        .setLabel("⏭")
        .setStyle(ButtonStyle.Primary),
    new ButtonBuilder()
        .setCustomId("np-restart-queue")
        .setLabel("🔄")
        .setStyle(ButtonStyle.Primary)
];

const row2Buttons: ButtonBuilder[] = [
    new ButtonBuilder()
        .setCustomId("np-repeat-song")
        .setLabel("🔂")
        .setStyle(ButtonStyle.Primary),
    new ButtonBuilder()
        .setCustomId("np-repeat-queue")
        .setLabel("🔁")
        .setStyle(ButtonStyle.Primary),
    new ButtonBuilder()
        .setCustomId("np-shuffle")
        .setLabel("🔀")
        .setStyle(ButtonStyle.Primary),
    new ButtonBuilder()
        .setCustomId("np-end")
        .setLabel("⏹")
        .setStyle(ButtonStyle.Primary),
    new ButtonBuilder()
        .setCustomId("np-restart-song")
        .setLabel("↩")
        .setStyle(ButtonStyle.Primary)
];

registerButton("np-prev", async (interaction: ButtonInteraction) => {
    const player: Player = cluster.getPlayer(interaction.guildId);
    if (player.track !== undefined) player.queue.add(player.queue.current, { next: true });
    await player.play(player.prev.pop(), { noReplace: false });
    await render(interaction);
});

registerButton("np-play", async (interaction: ButtonInteraction) => {
    const player: Player = cluster.getPlayer(interaction.guildId);
    await player.pause(false);
    await render(interaction);
});

registerButton("np-pause", async (interaction: ButtonInteraction) => {
    const player: Player = cluster.getPlayer(interaction.guildId);
    await player.pause(true);
    await render(interaction);
});

registerButton("np-next", async (interaction: ButtonInteraction) => {
    const player: Player = cluster.getPlayer(interaction.guildId);
    const current: Song = player.queue.current;
    if (!await player.queue.next()) {
        await player.stop();
    }
    player.queue.emit("trackEnd", current);
    await render(interaction);
});

registerButton("np-restart-queue", async (interaction: ButtonInteraction) => {
    const player: Player = cluster.getPlayer(interaction.guildId);
    player.queue.add(player.queue.current, { next: true });
    player.queue.add(player.prev, { next: true });
    await player.queue.next();
    await render(interaction);
});

registerButton("np-repeat-song", async (interaction: ButtonInteraction) => {
    const player: Player = cluster.getPlayer(interaction.guildId);
    if (player.queue.loop.type !== LoopType.Song)
        player.queue.setLoop(LoopType.Song);
    else if (player.queue.loop.type === LoopType.Song)
        player.queue.setLoop(LoopType.None);
    await render(interaction);
});

registerButton("np-repeat-queue", async (interaction: ButtonInteraction) => {
    const player: Player = cluster.getPlayer(interaction.guildId);
    if (player.queue.loop.type !== LoopType.Queue)
        player.queue.setLoop(LoopType.Queue);
    else if (player.queue.loop.type === LoopType.Queue)
        player.queue.setLoop(LoopType.None);
    await render(interaction);
});

registerButton("np-shuffle", async (interaction: ButtonInteraction) => {
    const player: Player = cluster.getPlayer(interaction.guildId);
    player.queue.shuffle();
    await render(interaction);
});

registerButton("np-end", async (interaction: ButtonInteraction) => {
    await (await interaction.guild.members.fetchMe()).voice.disconnect();
    await interaction.deleteReply();
});

registerButton("np-restart-song", async (interaction: ButtonInteraction) => {
    const player: Player = cluster.getPlayer(interaction.guildId);
    await player.play(player.queue.current, { noReplace: false });
    await render(interaction);
});

async function createEmbed(interaction: CommandInteraction | ButtonInteraction): Promise<EmbedBuilder> {
    const { queue: { current }, position } = cluster.getPlayer(interaction.guildId);
    const member: GuildMember = await interaction.guild.members.fetch(current.requester);

    const alwaysOn: boolean = (await getMusicSettingFromDb(interaction.guildId))[247];

    const embed: EmbedBuilder = new EmbedBuilder()
        .setAuthor({
            name: interaction.guild.name,
            iconURL: interaction.guild.iconURL({ extension: "png", forceStatic: false })
        })
        .setTitle("Now Playing")
        .setDescription(`24/7 music playing is ${alwaysOn ? "enabled" : "disabled"}`);
    if (current) {
        embed
            .addFields({
                name: `**${current.title}**\n${current.uri}`,
                value: `➡ Uploader: ${current.author} | Requester: ${member.user.tag} | Length: ${moment.utc(current.length).format("HH:mm:ss")}`
            })
            .setFooter({
                text: `${moment.utc(position).format("HH:mm:ss")} ${splitBar(current.length, position, 20)[0]} ${moment.utc(current.length).format("HH:mm:ss")}`
            });
    } else
        embed.addFields({
            name: "No song is being played",
            value: "Please add a song"
        });

    return embed;
}

async function render(interaction: CommandInteraction | ButtonInteraction): Promise<void> {
    const embed: EmbedBuilder = await createEmbed(interaction);
    const player: Player = cluster.getPlayer(interaction.guildId);

    // Yandere dev moment
    row1Buttons[0].setDisabled(player.prev.length === 0);
    row1Buttons[1].setDisabled(!player.paused);
    row1Buttons[2].setDisabled(player.paused);
    row1Buttons[3].setDisabled(player.track === undefined);

    if (player.queue.loop.type === LoopType.Queue) {
        row2Buttons[0].setStyle(ButtonStyle.Danger);
        row2Buttons[1].setStyle(ButtonStyle.Success);
    } else if (player.queue.loop.type === LoopType.Song) {
        row2Buttons[0].setStyle(ButtonStyle.Success);
        row2Buttons[1].setStyle(ButtonStyle.Danger);
    } else {
        row2Buttons[0].setStyle(ButtonStyle.Danger);
        row2Buttons[1].setStyle(ButtonStyle.Danger);
    }
    row2Buttons[2].setDisabled(!player.queue.tracks.length);
    row2Buttons[4].setDisabled(player.queue.current === null);

    await interaction.editReply({
        embeds: [embed],
        components: [
            // @ts-ignore
            new ActionRowBuilder()
                .addComponents(row1Buttons),
            // @ts-ignore
            new ActionRowBuilder()
                .addComponents(row2Buttons)
        ]
    });
}