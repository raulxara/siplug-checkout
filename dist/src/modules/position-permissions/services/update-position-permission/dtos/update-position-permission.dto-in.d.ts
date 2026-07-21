export declare class UpdatePositionPermissionDtoIn {
    readonly _id: string;
    readonly positionId: string | null;
    readonly permissionId: string | null;
    readonly config: Record<string, unknown> | null;
    readonly status: string | null;
    readonly source: string;
    constructor(params: {
        _id: string;
        positionId?: string | null;
        permissionId?: string | null;
        config?: Record<string, unknown> | null;
        status?: string | null;
        source?: string;
    });
}
