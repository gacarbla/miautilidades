import ConsoleController from "./console"
import { ErrorUtils } from "./errors"
import InteractionUtils from "./interactions"

class Counter {
    private x:number = 0

    /**Devuelve un nuevo valor no generado aún*/
    get next():number {
        return this.x++
    }
    /**Devuelve el último valor actualizado */
    get last():number {
        return this.x
    }
    /**Devuelve el anterior valor sin actualizarlo */
    get previous():number {
        return this.x - 1
    }

    /**Devuelve el valor anterior actualizando */
    get rollback():number {
        return this.x--
    }
}

export default class Utils {
    Counter:typeof Counter = Counter
    Interactions:typeof InteractionUtils = InteractionUtils
    console:ConsoleController = new ConsoleController()
    errorUtils = ErrorUtils
}

export {
    Counter,
    InteractionUtils,
    ErrorUtils
}