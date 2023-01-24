import { Collection, Colors, Message } from "discord.js";
import { getMemberFromDb, Member, MemberSchema } from "../db/schemas/Member.js";
import { getGuildLevelingSettingFromDb, LevelingConfigSchema } from "../db/schemas/LevelingConfig.js";

// @ts-ignore
import levelData from "../../conf/levels.json" assert { type: "json" };

const msgCache: Collection<string, Collection<string, Message>> = new Collection();

export async function handleLeveling(message: Message): Promise<void> {
    const leveling: LevelingConfigSchema = await getGuildLevelingSettingFromDb(message.guildId);

    if (leveling.restrictedChannels.length && leveling.restrictedChannels.includes(message.channelId))
        return;

    if (leveling.allowedChannels.length && !leveling.allowedChannels.includes(message.channelId))
        return;

    const member: MemberSchema = await getMemberFromDb(message.author.id, message.guildId);

    if (!msgCache.get(message.author.id) || (msgCache.get(message.author.id)) && (!msgCache.get(message.author.id).get(message.guildId))) {
        msgCache.set(message.author.id, new Collection<string, Message>().set(message.guildId, message));

        await setExp(member.id, message.guildId, member.exp + randExp(leveling.minXp, leveling.maxXp));
    }

    const msg: Message = msgCache.get(message.author.id).get(message.guildId);
    if (message.createdTimestamp - msg.createdTimestamp >= leveling.xpInterval) {
        await setExp(member.id, message.guildId, member.exp + randExp(leveling.minXp, leveling.maxXp));
        msgCache.get(message.author.id).set(message.guildId, message);
    }

    for (const level of levelData) {
        if (level.level === member.level + 1 && member.exp >= level.exp) {
            await setLevel(member.id, message.guildId, member.level + 1);

            let requiredExp: number = 0;

            for (const lvl of levelData) {
                if (lvl.level === member.level + 1) {
                    requiredExp = lvl.exp - member.exp;
                }
            }

            await message.reply({
                embeds: [
                    {
                        color: Colors.Aqua,
                        title: "Leveled Up!",
                        description: `Your new level is ${member.level + 1}`,
                        footer: {
                            text: requiredExp <= 0 ? "Maximum level reached" : `${requiredExp} exp until next level`
                        }
                    }
                ]
            });

            break;
        }
    }
}

function randExp(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

export async function setLevel(id: string, guild: string, level: number): Promise<void> {
    await Member.findOneAndUpdate(
        { id, guild },
        {
            $set: {
                level
            }
        }
    );
}

export async function setExp(id: string, guild: string, exp: number): Promise<void> {
    await Member.findOneAndUpdate(
        { id, guild },
        {
            $set: {
                exp
            }
        }
    );
}