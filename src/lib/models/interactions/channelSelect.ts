import { ChannelSelectMenuInteraction } from "discord.js";
import { MiauChannelSelectDefaultData } from "../../interfaces/interaction";
import MiauSelect from "./select";

export default class MiauChannelSelect extends MiauSelect {
    protected data: MiauChannelSelectDefaultData;

    constructor(data: MiauChannelSelectDefaultData) {
        super(data);
        this.data = data;
    }

    override async execution(context: ChannelSelectMenuInteraction): Promise<void> {
        await context.reply({ content: "Menú de selección de canal respondido, pero no se ha definido acción específica." });
    }

    override setExecution(f: (context: ChannelSelectMenuInteraction) => Promise<void>): void {
        this.execution = f;
    }
}
