import { Message, Interaction, AutocompleteInteraction } from "discord.js";
import MiauInteraction from "./interaction";

export default class MiauAutocomplete extends MiauInteraction {

    override async execution(interaction: AutocompleteInteraction):Promise<void> {
        await interaction.respond([])
    }

    override setExecution(fun: (interaction: AutocompleteInteraction) => Promise<void>): void {
        (this.execution as (interaction: AutocompleteInteraction) => Promise<void>) = fun;
    }

}