import { EventArgumentsMap, MiauEventDefaultData } from "../interfaces/events";
import { MiauEventType } from "../types/MiauEvents";

export default class MiauEvent {
    private data: MiauEventDefaultData;
    private trigger: MiauEventType | undefined;
    private execution?: (...args: any[]) => Promise<any>;

    get id() {
        return this.data.customId;
    }

    get triggersOn() {
        return this.trigger;
    }

    constructor(data: MiauEventDefaultData) {
        this.data = data;
    }

    async execute(...args: any[]): Promise<any> {
        if (this.execution) {
            await this.execution(...args);
        }
    }

    setExecution<T extends MiauEventType>(event: T, f: (...args: EventArgumentsMap[T]) => Promise<any>): void {
        this.trigger = event;
        this.execution = (...args: any[]) => f(...(args as EventArgumentsMap[T]));
    }
}