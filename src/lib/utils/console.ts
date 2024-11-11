import { ColorSchema, logRulesSchema } from "../interfaces/console";

type LogRulesKeys = Array<keyof logRulesSchema>;

class ConsoleController {
    static defaultColors: ColorSchema = {
        normal: '\x1b[37m',
        error: '\x1b[31m',
        success: '\x1b[32m',
        info: '\x1b[34m',
        warning: '\x1b[33m',
        test: '\x1b[33m',
        reset: '\x1b[0m',
    }

    static defaultLogRules: logRulesSchema = {}

    logRules: logRulesSchema
    colors: ColorSchema
    constructor(colors?: ColorSchema, logRules?: logRulesSchema) {
        this.colors = colors ?? ConsoleController.defaultColors
        this.logRules = logRules ?? ConsoleController.defaultLogRules
    }

    private shouldLog(type: LogRulesKeys) {
        let shouldLog = false;
        let allUndefined = true;

        type.forEach(logType => {
            const rule = this.logRules[logType];
            if (typeof rule !== "undefined") {
                allUndefined = false;
                if (rule) shouldLog = true;
            }
        });

        return shouldLog || allUndefined
    }

    log(type: LogRulesKeys, ...args: any[]) {
        if (!this.shouldLog(type)) return
        args.forEach(arg => {
            const printableArg = typeof arg === 'object' ? JSON.stringify(arg) : String(arg);
            console.log(`${this.colors.normal}[LOG ]${this.colors.reset} ${printableArg.replace(/\%tab\%/g, ' > ')}`);
        });
    }

    success(type: LogRulesKeys, ...args: any[]) {
        if (!this.shouldLog(type)) return
        args.forEach(arg => {
            const printableArg = typeof arg === 'object' ? JSON.stringify(arg) : String(arg);
            console.log(`${this.colors.success}[SUCC]${this.colors.reset} ${printableArg.replace(/\%tab\%/g, ' > ')}`)
        })
    }

    error(type: LogRulesKeys, ...args: any[]) {
        if (!this.shouldLog(type)) return
        args.forEach(arg => {
            const printableArg = typeof arg === 'object' ? JSON.stringify(arg) : String(arg);
            console.log(`${this.colors.error}[ERRO]${this.colors.reset} ${printableArg.replace(/\%tab\%/g, ' > ')}`)
        })
    }

    info(type: LogRulesKeys, ...args: any[]) {
        if (!this.shouldLog(type)) return
        args.forEach(arg => {
            const printableArg = typeof arg === 'object' ? JSON.stringify(arg) : String(arg);
            console.log(`${this.colors.info}[INFO]${this.colors.reset} ${printableArg.replace(/\%tab\%/g, ' > ')}`)
        })
    }

    warning(type: LogRulesKeys, ...args: any[]) {
        if (!this.shouldLog(type)) return
        args.forEach(arg => {
            const printableArg = typeof arg === 'object' ? JSON.stringify(arg) : String(arg);
            console.log(`${this.colors.warning}[WARN]${this.colors.reset} ${printableArg.replace(/\%tab\%/g, ' > ')}`)
        })
    }

    test(type: LogRulesKeys, ...args: any[]) {
        if (!this.shouldLog(type)) return
        args.forEach(arg => {
            const printableArg = typeof arg === 'object' ? JSON.stringify(arg) : String(arg);
            console.log(`${this.colors.test}[TEST]${this.colors.reset} ${printableArg.replace(/\%tab\%/g, ' > ')}`);
        });
    }
}

export default ConsoleController;