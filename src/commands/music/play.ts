import { ApplicationCommandOptionType, Colors, CommandInteraction, GuildMember, StageChannel, VoiceState } from "discord.js";
import { Player } from "lavaclient";
import { LoadTracksResponse } from "@lavaclient/types/v3";
import { cluster } from "../../modules/music.js";
import { IS_DEV, YOUTUBE_URL_REGEX } from "../../utils/constants.js";
import { registerCommand } from "../index.js";
import { Song } from "@lavaclient/queue";
import { BotConfig, BotConfigSchema } from "../../db/schemas/config/BotConfig.js";

declare module "lavaclient" {
    export interface Player {
        filterStatus: {
            nightcore: boolean,
            daycore: boolean,
            karaoke: boolean,
            vaporwave: boolean
        },
        prev: Song[]
    }
}

registerCommand({
    name: "play",
    description: "▶ Lets Tohru sing for you.",
    options: [
        {
            name: "url",
            description: "📎 The url to the track.",
            type: ApplicationCommandOptionType.String,
            required: true
        },
        {
            name: "next",
            description: "❓ Whether to place the song to the first.",
            type: ApplicationCommandOptionType.Boolean,
            required: false
        }
    ],
    async run(interaction: CommandInteraction): Promise<void> {
        const botConfig: BotConfigSchema = await BotConfig.findOne();
        if (!botConfig.modules.music) {
            await interaction.editReply({
                embeds: [
                    {
                        color: Colors.Red,
                        description: "❌ The music module is currently disabled."
                    }
                ]
            });
            return;
        }
        const url: string = interaction.options.get("url").value as string;
        const next: boolean = interaction.options.get("next") ?
            interaction.options.get("next").value as boolean : false;
        const member: GuildMember = await interaction.guild.members.fetch(
            interaction.user.id
        );
        const memberState: VoiceState = member.voice;
        const botState: VoiceState = (await interaction.guild.members.fetchMe()).voice;

        let player: Player = cluster.getPlayer(interaction.guildId);

        if (!memberState.channelId) {
            await interaction.editReply({
                embeds: [
                    {
                        color: Colors.Red,
                        description: "❌ You must join a voice channel first."
                    }
                ]
            });
            return;
        }

        if (!botState.channelId || (botState.channelId && !player)) {
            player = cluster.createPlayer(interaction.guildId);
        } else if (botState.channelId !== memberState.channelId) {
            await interaction.editReply({
                embeds: [
                    {
                        color: Colors.Red,
                        description: "❌ You must be in the same voice to use this command."
                    }
                ]
            });
            return;
        }

        let result: LoadTracksResponse;

        if (isUrl(url)) {
            if (YOUTUBE_URL_REGEX.test(url) && !IS_DEV) {
                await interaction.editReply({
                    embeds: [
                        {
                            color: Colors.Red,
                            description: "❌ Unsupported Provider."
                        }
                    ]
                });
                return;
            } else result = await cluster.rest.loadTracks(url);
        } else result = await cluster.rest.loadTracks(`scsearch:${url}`);

        switch (result.loadType) {
            case "SEARCH_RESULT":
            case "TRACK_LOADED":
                player.queue.add(result.tracks[0], { requester: member.user.id, next });
                await interaction.editReply({
                    embeds: [
                        {
                            color: Colors.Red,
                            description: `➕ Added track [**${result.tracks[0].info.title}**](${result.tracks[0].info.uri}) to the queue`,
                            footer: {
                                text: `Requested by ${member.user.tag}`
                            }
                        }
                    ]
                });
                break;
            case "PLAYLIST_LOADED":
                player.queue.add(result.tracks, { requester: member.user.id, next });
                await interaction.editReply({
                    embeds: [
                        {
                            color: Colors.Red,
                            description: `➕ Added playlist **${result.playlistInfo.name}** to the queue`,
                            footer: {
                                text: `Requested by ${member.user.tag}`
                            }
                        }
                    ]
                });
                break;
            case "NO_MATCHES":
                await interaction.editReply({
                    embeds: [
                        {
                            color: Colors.Red,
                            description: "❌ Nothing found."
                        }
                    ]
                });
                return;
            case "LOAD_FAILED":
                await interaction.editReply({
                    embeds: [
                        {
                            color: Colors.Red,
                            description: "❌ An error encountered. Please try again."
                        }
                    ]
                });
                return;
        }

        if (!player.connected) {
            if (memberState.channel instanceof StageChannel) {
                const stage: StageChannel = memberState.channel;
                player.connect(stage, { deafened: true });

                if (!stage.stageInstance) {
                    await stage.createStageInstance({
                        topic: "Music with Tohru",
                        sendStartNotification: false
                    });
                }

                await interaction.followUp({
                    embeds: [
                        {
                            color: Colors.Green,
                            description: "✌ I'm connected! Please invite me to speak."
                        }
                    ]
                });
            } else player.connect(memberState.channelId, { deafened: true });
        }

        if (!player.track) {
            player.filterStatus = {
                nightcore: false,
                daycore: false,
                karaoke: false,
                vaporwave: false
            };
            player.queue.on("trackEnd", (song: Song) => player.prev.push(song));
            player.prev = [];
            await player.queue.start();
        }

    }
});

function isUrl(str: string): boolean {
    try {
        new URL(str);
    } catch (e: any) {
        return false;
    }
    return true;
}
