import { AutocompleteInteraction } from "discord.js";
import MiauInteraction from "./interaction";
import { MiauAutocompleteDefaultData } from "../../interfaces/autocomplete";

export default class MiauAutocomplete extends MiauInteraction {

    data: MiauAutocompleteDefaultData

    constructor(data: MiauAutocompleteDefaultData) {
        super();
        this.data = data;
    }

    override async execution(interaction: AutocompleteInteraction):Promise<void> {
        await interaction.respond([])
    }

    override setExecution(fun: (interaction: AutocompleteInteraction) => Promise<void>): this {
        (this.execution as (interaction: AutocompleteInteraction) => Promise<void>) = fun;
        return this
    }

}