import MiauSlashSubcommandBuilder from "./slashSubcommandBuilder";
import client from "../../../..";
import { interactionNameRegEx } from "../../../constants/discord";

class MiauSlashSubcommandgroupBuilder {
    constructor() { }

    private console = client.utils.console

    subcommands: MiauSlashSubcommandBuilder[] = []
    name: string | undefined = undefined
    description: string | undefined = undefined

    setName(name: string): this {
        if (name.length < 1 || name.length > 32) {
            this.console.error(
                ["error", "commandBuildError"],
                "Tamaño incorrecto en el nombre. Debe ser de 1 a 32 caracteres."
            );
            throw new Error("El nombre debe tener entre 1 y 32 caracteres.");
        }
        if (name !== name.toLowerCase()) {
            this.console.warning(
                ["commandBuildError"],
                "Los comandos slash no aceptan mayúsculas en su nombre."
            );
        }
        if (!interactionNameRegEx.test(name)) {
            this.console.error(
                ["error", "commandBuildError"],
                "El nombre contiene caracteres inválidos."
            );
            throw new Error("El nombre contiene caracteres inválidos.");
        }
        this.name = name;
        return this;
    }
    

    setDescription(description: string): this {
        if (description.length < 1) {
            this.console.error(
                ["error", "commandBuildError"], 
                "La descripción debe tener al menos un carácter."
            );
            throw new Error("La descripción debe tener al menos un carácter.");
        }
        if (description.length > 100) {
            this.console.warning(
                ["commandBuildError"], 
                "La descripción no puede exceder los 100 caracteres."
            );
            description = description.substring(0, 100); // Recorta a 100 caracteres si es necesario
        }
        // TODO: Añadir verificación de que los caracteres empleados son válidos.
        this.description = description;
        return this;
    }    

    addSubcommand(s: (subcommand: MiauSlashSubcommandBuilder) => MiauSlashSubcommandBuilder):this {
        const subcommand = new MiauSlashSubcommandBuilder()
        const apply = s(subcommand)
        if (!apply.test()) throw new Error("El subcomando parece estar mal declarado.")
        if (this.subcommands.length >= 25) throw new Error("Este grupo ya tiene 25 subcomandos.")
        this.subcommands.push(apply)
        return this
    }

    test():boolean {
        // TODO: Actualizar para verificar que todos los subcomandos son válidos.
        return (
            typeof this.name === 'string' &&
            typeof this.description === 'string' &&
            this.name.length > 1 &&
            this.name.length <= 32 &&
            this.description.length > 1 &&
            this.description.length <= 100 &&
            this.subcommands.length > 1 &&
            this.subcommands.length <= 25
        );
    }

    toJSON() {
        // TODO: Actualizar para utilizar la función `test`
        if (!this.name || !this.description) {
            this.console.error(["error", "commandBuildError"], "Los campos de nombre y descripción son obligatorios.")
            throw new Error("Los campos de nombre y descripción son obligatorios.")
        }
        return {
            name: this.name.toLowerCase(),
            description: this.description,
            subcommands: this.subcommands.map(s => s.toJSON())
        }
    }

    // TODO: Permitir exportar para comando help
}

export default MiauSlashSubcommandgroupBuilder