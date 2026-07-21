import { GetPermissionByUniqueIdUseCase } from './get-permission-by-unique-id.use-case';
export declare class GetPermissionByUniqueIdController {
    private readonly getPermissionByUniqueIdUseCase;
    constructor(getPermissionByUniqueIdUseCase: GetPermissionByUniqueIdUseCase);
    handle(body: Record<string, unknown>): Promise<{
        status: string;
        message: string;
        data: {
            permission: Record<string, unknown>;
        };
    }>;
}
