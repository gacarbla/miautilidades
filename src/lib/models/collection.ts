import client from "../..";
import { CollectionItem } from "../types/collection";

class Collection<T = any> {
    private content: Record<string, CollectionItem<T>> = {};
    private count = new client.utils.Counter()

    constructor() {}

    private generateId = (): number => {
        return this.count.next
    }

    add = (value: T, customId?: string): string | number => {
        const id = customId ?? this.generateId();

        if (this.content[id]) {
            throw new Error(`ID "${id}" is already in use. Choose a different ID or do not provide a custom ID.`)
        }

        const now = new Date();
        this.content[id] = {
            id,
            value,
            createdAt: now,
            updatedAt: now
        };
        return id;
    }

    get = (id: string): T | undefined => {
        return this.content[id]?.value;
    }

    update = (id: string, newValue: T): boolean => {
        const item = this.content[id];
        if (item) {
            item.value = newValue;
            item.updatedAt = new Date();
            return true;
        }
        console.warn(`Item with ID "${id}" does not exist.`);
        return false;
    }

    delete = (id: string): boolean => {
        if (this.content[id]) {
            delete this.content[id];
            return true;
        }
        console.warn(`Item with ID "${id}" does not exist.`);
        return false;
    }

    getAll = (): CollectionItem<T>[] => {
        return Object.values(this.content);
    }

    get protected(): ProtectedCollection<T> {
        return new ProtectedCollection(this.content)
    }
}

class ProtectedCollection<T = any> {
    private content:Record<string, CollectionItem<T>> = {}
    private count = new client.utils.Counter()
    
    constructor(data:Record<string, CollectionItem<T>>) {
        this.content = data
    }

    private generateId = (): number => {
        return this.count.next
    }

    get = (id: string): T | undefined => {
        return this.content[id]?.value;
    }

    getAll = (): CollectionItem<T>[] => {
        return Object.values(this.content);
    }
}

export default Collection;
export { Collection, ProtectedCollection }