export declare class UpdatePermissionByUniqueIdDtoIn {
    readonly permissionId: string;
    readonly officeId?: string;
    readonly name?: string;
    readonly slug?: string;
    readonly description?: string;
    readonly entity?: string;
    readonly action?: string;
    readonly config?: Record<string, unknown>;
    readonly status?: string;
    constructor(params: {
        permissionId?: unknown;
        _id?: unknown;
        officeId?: unknown;
        name?: unknown;
        slug?: unknown;
        description?: unknown;
        entity?: unknown;
        action?: unknown;
        config?: unknown;
        status?: unknown;
    });
    private normalizeOptionalString;
}
