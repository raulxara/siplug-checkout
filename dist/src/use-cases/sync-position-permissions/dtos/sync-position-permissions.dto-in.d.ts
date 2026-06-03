export declare class SyncPositionPermissionsDtoIn {
    readonly token: string;
    readonly positionId: string;
    readonly permissionIds: string[];
    readonly source: string;
    constructor(params: {
        token?: string;
        positionId?: string;
        permissionIds?: string[];
        source?: string;
    });
}
