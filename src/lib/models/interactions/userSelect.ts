import { UserSelectMenuInteraction } from "discord.js";
import { MiauUserSelectDefaultData } from "../../interfaces/interaction";
import MiauSelect from "./select";

export default class MiauUserSelect extends MiauSelect {
    protected data: MiauUserSelectDefaultData;
    constructor(data: MiauUserSelectDefaultData) {
        super(data);
        this.data = data;
    }

    override async execution(context: UserSelectMenuInteraction): Promise<void> {
        await context.reply({ content: "Menú de selección de canal respondido, pero no se ha definido acción específica." });
    }

    override setExecution(f: (context: UserSelectMenuInteraction) => Promise<void>): void {
        this.execution = f;
    }
}