import { ListPermissionByOfficeIdUseCase } from './list-permission-by-office-id.use-case';
export declare class ListPermissionByOfficeIdController {
    private readonly listPermissionByOfficeIdUseCase;
    constructor(listPermissionByOfficeIdUseCase: ListPermissionByOfficeIdUseCase);
    handle(body: Record<string, unknown>): Promise<{
        status: string;
        message: string;
        data: {
            permissions: Record<string, unknown>[];
            total: number;
        };
    }>;
}
