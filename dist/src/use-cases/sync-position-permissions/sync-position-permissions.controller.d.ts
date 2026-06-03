import { SyncPositionPermissionsRequest } from './http/sync-position-permissions.request';
import { SyncPositionPermissionsUseCase } from './sync-position-permissions.use-case';
export declare class SyncPositionPermissionsController {
    private readonly syncPositionPermissionsUseCase;
    constructor(syncPositionPermissionsUseCase: SyncPositionPermissionsUseCase);
    handle(body: SyncPositionPermissionsRequest, authorization?: string): Promise<{
        status: string;
        message: string;
        data: import("./dtos/sync-position-permissions.dto-out").SyncPositionPermissionsDtoOut;
    }>;
}
