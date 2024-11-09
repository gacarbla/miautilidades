import { ButtonStyle } from "discord.js"

export interface MiauButtonBuildData {
    
    /**
     * > ** **
     * ### ¿Qué se debe colocar aquí?
     * Booleano que indique si el botón está desactivado o no.
     * > ** **
     * ### Ejemplos
     * ```ts
     * disabled: undefined // Botón habilitado
     * disabled: false // Botón habilitado
     * disabled: true // Botón deshabilitado
     * ```
     */
    disabled?: boolean
    
    /**
     * > ** **
     * ### ¿Qué se debe colocar aquí?
     * Indica la label que quieres que tenga el botón si no quieres que siga la label por defecto del constructor.
     * > ** **
     * ### Ejemplos
     * ```ts
     * customLabel: undefined // Utiliza la label del constructor
     * customLabel: 'Ejemplo' // Utiliza la label indicada
     * ```
     */
    customLabel?: string

    /**
     * > ** **
     * ### ¿Qué se debe colocar aquí?
     * Indica el emoji del botón si quieres utilizar uno diferente al del constructor.
     * > ** **
     * ### Ejemplos
     * ```ts
     * customEmoji: undefined // Utiliza el emoji del constructor
     * customEmoji: '⚠️' // Utiliza el emoji indicado
     * ```
     */
    customEmoji?: string

    /**
     * > ** **
     * ### ¿Qué se debe colocar aquí?
     * Parámetros que deben ser añadidos a la ID de este botón.
     * 
     * > ** **
     * 
     * ### Ejemplos
     * ```ts
     * params: ['play', userid] // Id resultado: <customId>_play_643575943289634836
     *  
     * // En la función execution se obtendrán los siguientes parámretos:
     * ['play', '643575943289634836']
     * ```
     * > ** **
     * ### ⚠️ ¡¡CUIDADO!!
     * El límite son 100 caracteres, contando la customId especificada y separadores de parámetros.
     * Tampoco se pueden introducir strings que contengan el símbolo `_`, pues se confundiría con el separador.
     */
    params?: string[]
}

export interface MiauButtonDefaultData {
    name: string,
    label: string,
    customId: string,
    style: ButtonStyle,
    isRestricted: boolean,
    emoji?: string
}