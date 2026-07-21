import { UpdatePermissionByUniqueIdUseCase } from './update-permission-by-unique-id.use-case';
export declare class UpdatePermissionByUniqueIdController {
    private readonly updatePermissionByUniqueIdUseCase;
    constructor(updatePermissionByUniqueIdUseCase: UpdatePermissionByUniqueIdUseCase);
    handle(body: Record<string, unknown>): Promise<{
        status: string;
        message: string;
        data: {
            permission: Record<string, unknown>;
        };
    }>;
}
