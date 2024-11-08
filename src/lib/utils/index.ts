import ConsoleController from "./console"

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
    console:ConsoleController = new ConsoleController()
}

export {
    Counter
}