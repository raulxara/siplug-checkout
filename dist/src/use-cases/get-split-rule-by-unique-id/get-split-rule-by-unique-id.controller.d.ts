import { GetSplitRuleByUniqueIdRequest } from './http/get-split-rule-by-unique-id.request';
import { GetSplitRuleByUniqueIdUseCase } from './get-split-rule-by-unique-id.use-case';
export declare class GetSplitRuleByUniqueIdController {
    private readonly getSplitRuleByUniqueIdUseCase;
    constructor(getSplitRuleByUniqueIdUseCase: GetSplitRuleByUniqueIdUseCase);
    handle(request: GetSplitRuleByUniqueIdRequest, authorization?: string): Promise<{
        status: string;
        message: string;
        data: {
            splitRule: Record<string, unknown>;
        };
    }>;
    private resolveToken;
}
