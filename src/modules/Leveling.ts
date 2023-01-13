import { Collection, Colors, Message } from "discord.js";
import { GuildConfig, GuildConfigSchema } from "../db/schemas/GuildConfig.js";
import { Member, MemberSchema } from "../db/schemas/Member.js";
import { defaultGuildSetting } from "../utils/defaultSettings.js";

// @ts-ignore
import levelData from "../../conf/levels.json" assert { type: "json" };

const msgCache: Collection<string, Collection<string, Message>> = new Collection();

export async function handleLeveling(message: Message): Promise<void> {
    let guildConfig: GuildConfigSchema = await GuildConfig.findOne({
        id: message.guildId
    });

    if (!guildConfig) {
        guildConfig = await GuildConfig.create(defaultGuildSetting(message.guild));
    }

    let member: MemberSchema = await Member.findOne({
        id: message.author.id
    });

    if (!member) {
        member = await Member.create({
            id: message.author.id,
            guild: message.guildId,
            exp: 0,
            level: 0
        });
    }
    if (!msgCache.get(message.author.id) || (msgCache.get(message.author.id)) && (!msgCache.get(message.author.id).get(message.guildId))) {
        msgCache.set(message.author.id, new Collection<string, Message>().set(message.guildId, message));

        await setExp(member.id, member.exp + randExp(guildConfig.leveling.minXp, guildConfig.leveling.maxXp));
    }

    const msg: Message = msgCache.get(message.author.id).get(message.guildId);
    if (message.createdTimestamp - msg.createdTimestamp >= guildConfig.leveling.xpInterval) {
        await setExp(member.id, member.exp + randExp(guildConfig.leveling.minXp, guildConfig.leveling.maxXp));
        msgCache.get(message.author.id).set(message.guildId, message);
    }

    member = await Member.findOne({
        id: message.author.id
    });

    for (const level of levelData) {
        if (level.level === member.level + 1 && member.exp >= level.exp) {
            await setLevel(member.id, member.level + 1);

            await message.reply({
                embeds: [
                    {
                        color: Colors.Aqua,
                        title: "Leveled Up!",
                        description: `Your new level is ${member.level + 1}`,
                        footer: {
                            text: `${level.exp - member.exp} exp until next level`
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

async function setLevel(id: string, level: number): Promise<void> {
    await Member.findOneAndUpdate(
        { id },
        {
            $set: {
                level
            }
        }
    );
}

async function setExp(id: string, exp: number): Promise<void> {
    await Member.findOneAndUpdate(
        { id },
        {
            $set: {
                exp
            }
        }
    );
}