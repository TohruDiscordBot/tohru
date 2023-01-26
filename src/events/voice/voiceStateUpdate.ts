import { GuildMember, StageChannel, VoiceState } from "discord.js";
import { Player } from "lavaclient";
import { client } from "../../client.js";
import { getMusicSettingFromDb, MusicConfigSchema } from "../../db/schemas/MusicConfig.js";
import { cluster } from "../../modules/Music.js";

client.on("voiceStateUpdate", async (oldState: VoiceState, newState: VoiceState) => {
    const musicCfg: MusicConfigSchema = await getMusicSettingFromDb(oldState.guild.id);

    if (oldState.channelId && !newState.channelId) {
        if (musicCfg[247]) return;
        if (oldState.member === await oldState.guild.members.fetchMe())
            await exitVoice(oldState);

        if (oldState.channel.members.get(oldState.client.user.id)) {
            const members: number = oldState.channel.members.filter(
                (val: GuildMember) => !val.user.bot
            ).size;

            if (members === 0) await exitVoice(oldState);
        }
    }
});

async function exitVoice(state: VoiceState): Promise<void> {
    const player: Player = cluster.getPlayer(state.guild.id);
    if (player) {
        player.disconnect();
        await cluster.destroyPlayer(player.guildId);
    } else await state.disconnect();

    if (state.channel instanceof StageChannel) {
        const stage: StageChannel = state.channel;
        await stage.stageInstance.delete();
    }
}