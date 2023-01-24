import { GuildMember, StageChannel, VoiceState } from "discord.js";
import { client } from "../../client.js";
import { getMusicSettingFromDb, MusicConfigSchema } from "../../db/schemas/MusicConfig.js";
import { cluster } from "../../modules/Music.js";

client.on("voiceStateUpdate", async (oldState: VoiceState, newState: VoiceState) => {
    const musicCfg: MusicConfigSchema = await getMusicSettingFromDb(oldState.guild.id);

    if (oldState.channelId && !newState.channelId) {
        if (musicCfg[247]) return;

        if (oldState.channel.members.has(client.user.id)) {
            let members: number = oldState.channel.members.filter(
                (val: GuildMember) => !val.user.bot
            ).size;

            if (members === 0 || oldState.member === await oldState.guild.members.fetchMe()) {
                await newState.disconnect();
                await cluster.destroyPlayer(oldState.guild.id);

                if (oldState.channel instanceof StageChannel) {
                    const stage: StageChannel = oldState.channel;

                    await stage.stageInstance.delete();
                }
            }
        }
    }
});