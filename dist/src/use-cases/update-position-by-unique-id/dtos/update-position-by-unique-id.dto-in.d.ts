export declare class UpdatePositionByUniqueIdDtoIn {
    readonly positionId: string;
    readonly officeId?: string;
    readonly name?: string;
    readonly slug?: string;
    readonly description?: string;
    readonly config?: Record<string, unknown>;
    readonly status?: string;
    constructor(params: {
        positionId?: unknown;
        _id?: unknown;
        officeId?: unknown;
        name?: unknown;
        slug?: unknown;
        description?: unknown;
        config?: unknown;
        status?: unknown;
    });
    private normalizeOptionalString;
}
