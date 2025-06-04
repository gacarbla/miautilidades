import { AutocompleteInteraction, ButtonInteraction, ChatInputCommandInteraction, Interaction, Message } from "discord.js";
import Preconditions from "../preconditions";
import client from "../../..";
import Emoji from "../../enum/emojis";
import ConsoleController from "../../utils/console";

/**
 * > ** **
 * ### ¿Qué es esto?
 * Constructor base de todas las interacciones.
 * 
 * **No se recomienda su uso.**
 */
export default abstract class MiauInteraction {
    private preconditions:Preconditions[]|undefined
    noPermissionMenssage:string|undefined
    console: ConsoleController

    constructor() {
        this.console = client.utils.console
    }

    async execute(context: Message | Interaction): Promise<any> {
        const able = await this.checkPreconditions(context)
        if (!able) {
            if ( context instanceof AutocompleteInteraction ) return context.respond([])
            if ( context instanceof Message ) return context.reply({content: this.noPermissionMenssage??`${Emoji.ERROR} No tienes permisos para ejecutar este comando de texto.`})
            context.reply({content: this.noPermissionMenssage??`${Emoji.ERROR} No tienes permisos para ejecutar esta interacción.`, ephemeral: true})
        } else {
            if (typeof this.execution != 'function') return this.handleNotFound(context)
            try {
                this.execution(context)
            } catch {

            }
        }
    }

    addPreconditions(...preconditions:Preconditions[]): this {
        let s = 0, f = 0
        this.preconditions?.forEach(precondition => {
            if (precondition.test()) {
                preconditions.push(precondition)
                s++
            } else {
                f++
            }
        })
        client.utils.console.log(
            ['interactionPreconditionsBuildLog'],
            `Cargadas ${s} precondiciones exitosamente. ${f>0?`${f} han fallado`:''}`
        )
        f>0?client.utils.console.error(
            ['interactionPreconditionsBuildError', 'error'],
            `${f} precondiciones han fallado`
        ):undefined
        return this
    }

    async checkPreconditions(context: Message | Interaction): Promise<boolean> {
        if (!this.preconditions || this.preconditions.length === 0) return true;
        const results = await Promise.all(this.preconditions.map(p => p.check(context)));
        return results.some(result => result);
    }

    abstract execution?(context: Message | Interaction, params?:any): Promise<void>;

    setExecution?(fun: (context: Message | Interaction) => Promise<void>): this {
        (this.execution as (context: Message | Interaction) => Promise<void>) = fun;
        return this
    }

    protected async handleNotFound(context: Message | Interaction) {
        if (context instanceof Message) {
            await context.reply({ content: "Oh oh... ¡No encuentro qué hace esto!" });
        } else if (context instanceof ChatInputCommandInteraction) {
            await context.reply({ content: 'Oh oh... ¡No encuentro qué hace este comando!', ephemeral: true })
        } else if (context instanceof ButtonInteraction) {
            await context.reply({ content: 'Oh oh... ¡No encuentro qué hace este botón!', ephemeral: true });
        }
    }
}
