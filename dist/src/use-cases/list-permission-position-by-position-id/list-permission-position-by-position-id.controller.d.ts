import { ListPermissionPositionByPositionIdUseCase } from './list-permission-position-by-position-id.use-case';
export declare class ListPermissionPositionByPositionIdController {
    private readonly listPermissionPositionByPositionIdUseCase;
    constructor(listPermissionPositionByPositionIdUseCase: ListPermissionPositionByPositionIdUseCase);
    handle(body: Record<string, unknown>): Promise<{
        status: string;
        message: string;
        data: {
            positionPermissions: Record<string, unknown>[];
            total: number;
        };
    }>;
}
