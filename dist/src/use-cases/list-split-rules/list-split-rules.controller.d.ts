import { ListSplitRulesRequest } from './http/list-split-rules.request';
import { ListSplitRulesUseCase } from './list-split-rules.use-case';
export declare class ListSplitRulesController {
    private readonly listSplitRulesUseCase;
    constructor(listSplitRulesUseCase: ListSplitRulesUseCase);
    handle(request: ListSplitRulesRequest, authorization?: string): Promise<{
        status: string;
        message: string;
        data: {
            splitRules: Record<string, unknown>[];
        };
    }>;
    private resolveToken;
}
