import { Collection, Message } from "discord.js";
import { GuildConfig, GuildConfigSchema } from "../db/schemas/GuildConfig.js";
import { Member, MemberSchema } from "../db/schemas/Member.js";

const msgCache: Collection<string, Collection<string, Message>> = new Collection();

export async function handleLeveling(message: Message): Promise<void> {
    const member: MemberSchema = await Member.findOne({
        id: message.author.id
    });

    const guildConfig: GuildConfigSchema = await GuildConfig.findOne({
        id: message.guildId
    });
    if (!msgCache.get(message.author.id) || (msgCache.get(message.author.id)) && (!msgCache.get(message.author.id).get(message.guildId))) {
        msgCache.set(message.author.id, new Collection<string, Message>().set(message.guildId, message));

        await Member.findOneAndUpdate(
            { id: message.author.id },
            {
                $set: {
                    exp: member.exp + randExp(guildConfig.leveling.minXp, guildConfig.leveling.maxXp)
                }
            }
        );
    }

    const msg: Message = msgCache.get(message.author.id).get(message.guildId);
    if (message.createdTimestamp - msg.createdTimestamp >= guildConfig.leveling.xpInterval) {
        await Member.findOneAndUpdate(
            { id: message.author.id },
            {
                $set: {
                    exp: member.exp + randExp(guildConfig.leveling.minXp, guildConfig.leveling.maxXp)
                }
            }
        );
        msgCache.get(message.author.id).set(message.guildId, message);
    }
}

function randExp(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1) + min);
}