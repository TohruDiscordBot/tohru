import { Collection, Message } from "discord.js";
import { getMemberFromDb, MemberLeveling, MemberLevelingSchema } from "../db/schemas/member/MemberLeveling.js";
import { getGuildLevelingSettingFromDb, LevelingConfigSchema } from "../db/schemas/guild/LevelingConfig.js";
import { BotConfig, BotConfigSchema } from "../db/schemas/config/BotConfig.js";
import { LevelData } from "../db/schemas/config/LevelData.js";

const msgCache: Collection<string, Collection<string, Message>> = new Collection();
const levelData = (await LevelData.findOne()).data;

export async function handleLeveling(message: Message): Promise<void> {
    const botConfig: BotConfigSchema = await BotConfig.findOne();
    if (botConfig.modules.leveling) return;
    const leveling: LevelingConfigSchema = await getGuildLevelingSettingFromDb(message.guildId);

    if (!leveling.enable) return;

    if (leveling.restrictedChannels.length && leveling.restrictedChannels.includes(message.channelId))
        return;

    if (leveling.allowedChannels.length && !leveling.allowedChannels.includes(message.channelId))
        return;

    const member: MemberLevelingSchema = await getMemberFromDb(message.author.id, message.guildId);

    if (!msgCache.get(message.author.id) || (msgCache.get(message.author.id)) && (!msgCache.get(message.author.id).get(message.guildId))) {
        msgCache.set(message.author.id, new Collection<string, Message>().set(message.guildId, message));

        await setExp(member.id, message.guildId, member.exp + randExp(leveling.minXp, leveling.maxXp));
    }

    const msg: Message = msgCache.get(message.author.id).get(message.guildId);
    if (message.createdTimestamp - msg.createdTimestamp >= leveling.xpInterval * 1000) {
        await setExp(member.id, message.guildId, member.exp + randExp(leveling.minXp, leveling.maxXp));
        msgCache.get(message.author.id).set(message.guildId, message);
    }

    const newMember: MemberLevelingSchema = await getMemberFromDb(message.author.id, message.guildId);

    if (newMember.level !== member.level) {
        const currentExp: number = newMember.exp;
        let reqExp: number = 0;

        if (newMember.level < 100)
            for (let i: number = 1; i < levelData.length; i++) {
                if ((levelData[i - 1].exp <= currentExp) && (levelData[i].exp >= currentExp)) {
                    reqExp = levelData[i].exp - currentExp;
                }
            }

        await message.reply({
            embeds: [
                {
                    title: "Leveled Up!",
                    description: `Your new level is ${newMember.level}`,
                    footer: {
                        text: reqExp === 0 ? "Maximum level reached" : `Required exp to next level: ${reqExp}`
                    }
                }
            ]
        });
    }
}

function randExp(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

export async function updateLevel(id: string, guild: string): Promise<void> {
    const member: MemberLevelingSchema = await getMemberFromDb(id, guild);

    const exp: number = member.exp;
    let level: number = 1;

    for (let i: number = 1; i < levelData.length; i++) {
        if ((levelData[i - 1].exp <= exp) && (levelData[i].exp >= exp)) {
            level = levelData[i - 1].level;
        }
    }

    await MemberLeveling.findOneAndUpdate(
        { id, guild },
        {
            $set: {
                level
            }
        }
    );

}

export async function setExp(id: string, guild: string, exp: number): Promise<void> {
    await MemberLeveling.findOneAndUpdate(
        { id, guild },
        {
            $set: {
                exp
            }
        }
    );

    await updateLevel(id, guild);
}