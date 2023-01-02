import { ButtonComponent, ButtonInteraction } from "discord.js";

export interface Button extends ButtonComponent {
    run(interaction: ButtonInteraction): Promise<void>
}