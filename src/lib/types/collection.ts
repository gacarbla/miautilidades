export type CollectionItem<T> = {
    id: string | number;
    value: T;
    createdAt: Date;
    updatedAt: Date;
};