import { ListPositionByOfficeIdUseCase } from './list-position-by-office-id.use-case';
export declare class ListPositionByOfficeIdController {
    private readonly listPositionByOfficeIdUseCase;
    constructor(listPositionByOfficeIdUseCase: ListPositionByOfficeIdUseCase);
    handle(body: Record<string, unknown>): Promise<{
        status: string;
        message: string;
        data: {
            positions: Record<string, unknown>[];
            total: number;
        };
    }>;
}
