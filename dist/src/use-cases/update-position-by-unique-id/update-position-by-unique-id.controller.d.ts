import { UpdatePositionByUniqueIdUseCase } from './update-position-by-unique-id.use-case';
export declare class UpdatePositionByUniqueIdController {
    private readonly updatePositionByUniqueIdUseCase;
    constructor(updatePositionByUniqueIdUseCase: UpdatePositionByUniqueIdUseCase);
    handle(body: Record<string, unknown>): Promise<{
        status: string;
        message: string;
        data: {
            position: Record<string, unknown>;
        };
    }>;
}
