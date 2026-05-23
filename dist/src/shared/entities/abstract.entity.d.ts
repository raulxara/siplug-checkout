export declare abstract class AbstractEntity {
    id: number | null;
    _id: string | null;
    createdAt: string | null;
    updatedAt: string | null;
    status: string | null;
    hydrate(data: Record<string, unknown>): this;
}
