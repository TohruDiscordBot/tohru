import { Colors, CommandInteraction } from "discord.js";
import { BotConfig, BotConfigSchema } from "../db/schemas/config/BotConfig.js";
import { PreconditionResult } from "../types/Precondition.js";
import { registerPrecondition } from "./index.js";

registerPrecondition({
    name: "requireOwner",
    async run(interaction: CommandInteraction): Promise<PreconditionResult> {
        const config: BotConfigSchema = await BotConfig.findOne();

        if (!config.owners.includes(interaction.user.id)) {
            await interaction.editReply({
                embeds: [
                    {
                        color: Colors.Red,
                        description: "❌ You must be the owner in order to use this command."
                    }
                ]
            });
            return PreconditionResult.Error;
        }

        return PreconditionResult.Ok;
    }
});