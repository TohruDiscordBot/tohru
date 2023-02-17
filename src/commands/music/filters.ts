import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, CommandInteraction, EmbedBuilder } from "discord.js";
import { Player } from "lavaclient";
import { cluster } from "../../modules/music.js";
import { clearFilters, toggleDaycore, toggleKaraoke, toggleNightcore, toggleVaporWave } from "../../utils/filterHelpers.js";
import { registerButton, registerCommand } from "../index.js";

const buttons: ButtonBuilder[] = [
    new ButtonBuilder()
        .setCustomId("f-nightcore")
        .setLabel("🌃")
        .setStyle(ButtonStyle.Primary),
    new ButtonBuilder()
        .setCustomId("f-daycore")
        .setLabel("☀")
        .setStyle(ButtonStyle.Primary),
    new ButtonBuilder()
        .setCustomId("f-karaoke")
        .setLabel("🎤")
        .setStyle(ButtonStyle.Primary),
    new ButtonBuilder()
        .setCustomId("f-vaporwave")
        .setLabel("🌊")
        .setStyle(ButtonStyle.Primary),
    new ButtonBuilder()
        .setCustomId("f-clear")
        .setLabel("❎")
        .setStyle(ButtonStyle.Primary)
];

registerCommand({
    name: "filters",
    description: "Spice up your music with filters.",
    preconditions: ["activePlayer"],
    async run(interaction: CommandInteraction): Promise<void> {
        await render(interaction);
    }
});

registerButton("f-nightcore",
    async (interaction: ButtonInteraction) => {
        await toggleNightcore(cluster.getPlayer(interaction.guildId));
        await render(interaction);
    }
);

registerButton("f-daycore",
    async (interaction: ButtonInteraction) => {
        await toggleDaycore(cluster.getPlayer(interaction.guildId));
        await render(interaction);
    }
);

registerButton("f-karaoke",
    async (interaction: ButtonInteraction) => {
        await toggleKaraoke(cluster.getPlayer(interaction.guildId));
        await render(interaction);
    }
);

registerButton("f-vaporwave",
    async (interaction: ButtonInteraction) => {
        await toggleVaporWave(cluster.getPlayer(interaction.guildId));
        await render(interaction);
    }
);

registerButton("f-clear",
    async (interaction: ButtonInteraction) => {
        await clearFilters(cluster.getPlayer(interaction.guildId));
        await render(interaction);
    }
);

async function render(interaction: CommandInteraction | ButtonInteraction): Promise<void> {
    const player: Player = cluster.getPlayer(interaction.guildId);

    const { filterStatus } = player;

    const embed: EmbedBuilder = new EmbedBuilder()
        .setAuthor({
            name: interaction.guild.name,
            iconURL: interaction.guild.iconURL({ extension: "png", forceStatic: false })
        })
        .setTitle("Filter controller");

    for (const [key, val] of Object.entries(filterStatus)) {
        embed.addFields({
            name: key,
            value: val ? "Enabled" : "Disabled",
            inline: true
        });
    }

    const row: ActionRowBuilder = new ActionRowBuilder()
        .addComponents(buttons);

    await interaction.editReply({
        embeds: [embed],
        components: [
            // @ts-ignore
            row
        ]
    });
}