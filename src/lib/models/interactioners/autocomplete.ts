import { AutocompleteInteraction } from "discord.js";
import MiauInteraction from "./interaction";
import { MiauAutocompleteDefaultData } from "../../interfaces/autocomplete";

export default class MiauAutocomplete extends MiauInteraction {

    data: MiauAutocompleteDefaultData

    constructor(data: MiauAutocompleteDefaultData) {
        super();
        this.data = data;
    }

    override async execution(interaction: AutocompleteInteraction):Promise<any> {
        await interaction.respond([])
    }

    override setExecution(fun: (interaction: AutocompleteInteraction) => Promise<any>): this {
        (this.execution as (interaction: AutocompleteInteraction) => Promise<any>) = fun;
        return this
    }

}