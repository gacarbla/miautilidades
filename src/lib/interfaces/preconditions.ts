import { Interaction, Message } from "discord.js";
import { MiauInteractionTypes, PreconditionMethod } from "../types/interactions";

export interface preconditionConstructorData {
    /** Nombre interno identificativo del grupo de precondiciones */
    name: string;
    /** Método de evaluación: 'all' = todas deben cumplirse, 'one' = al menos una, 'none' = ninguna */
    method: PreconditionMethod;
}

export interface preconditionData {
    /** Nombre de la precondición (para logs o ayuda) */
    name: string;
    /** Tipos de interacción donde se aplica */
    applyTo: MiauInteractionTypes[];
    /** Función que evalúa si se cumple la condición */
    function: (context: Message | Interaction) => Promise<boolean>;
}