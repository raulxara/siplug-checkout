import { ListSplitRulesByOfficeIdRequest } from './http/list-split-rules-by-office-id.request';
import { ListSplitRulesByOfficeIdUseCase } from './list-split-rules-by-office-id.use-case';
export declare class ListSplitRulesByOfficeIdController {
    private readonly listSplitRulesByOfficeIdUseCase;
    constructor(listSplitRulesByOfficeIdUseCase: ListSplitRulesByOfficeIdUseCase);
    handle(request: ListSplitRulesByOfficeIdRequest, authorization?: string): Promise<{
        status: string;
        message: string;
        data: {
            splitRules: Record<string, unknown>[];
        };
    }>;
    private resolveToken;
}
