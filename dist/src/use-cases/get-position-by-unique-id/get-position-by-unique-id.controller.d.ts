import { GetPositionByUniqueIdUseCase } from './get-position-by-unique-id.use-case';
export declare class GetPositionByUniqueIdController {
    private readonly getPositionByUniqueIdUseCase;
    constructor(getPositionByUniqueIdUseCase: GetPositionByUniqueIdUseCase);
    handle(body: Record<string, unknown>): Promise<{
        status: string;
        message: string;
        data: {
            position: Record<string, unknown>;
        };
    }>;
}
