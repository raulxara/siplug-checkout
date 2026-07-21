export declare class UpdatePermissionDtoIn {
    readonly _id: string;
    readonly officeId: string | null;
    readonly name: string | null;
    readonly slug: string | null;
    readonly description: string | null;
    readonly entity: string | null;
    readonly action: string | null;
    readonly config: Record<string, unknown> | null;
    readonly status: string | null;
    readonly source: string;
    constructor(params: {
        _id: string;
        officeId?: string | null;
        name?: string | null;
        slug?: string | null;
        description?: string | null;
        entity?: string | null;
        action?: string | null;
        config?: Record<string, unknown> | null;
        status?: string | null;
        source?: string;
    });
}
