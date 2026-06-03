export declare class CreatePositionPermissionDtoIn {
    readonly positionId: string;
    readonly permissionId: string;
    readonly config: Record<string, unknown> | null;
    readonly status: string;
    constructor(params: {
        positionId: string;
        permissionId: string;
        config?: Record<string, unknown> | null;
        status?: string;
    });
}
