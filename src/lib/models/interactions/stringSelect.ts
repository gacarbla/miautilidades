import { StringSelectMenuInteraction } from "discord.js";
import { MiauStringSelectDefaultData } from "../../interfaces/interaction";
import MiauSelect from "./select";

export default class MiauStringSelect extends MiauSelect {
    protected data: MiauStringSelectDefaultData;
    constructor(data: MiauStringSelectDefaultData) {
        super(data);
        this.data = data;
    }

    override async execution(context: StringSelectMenuInteraction): Promise<void> {
        await context.reply({ content: "Menú de selección de canal respondido, pero no se ha definido acción específica." });
    }

    override setExecution(f: (context: StringSelectMenuInteraction) => Promise<void>): void {
        this.execution = f;
    }
}