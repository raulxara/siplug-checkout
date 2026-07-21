import { UpdateSplitRuleRequest } from './http/update-split-rule.request';
import { UpdateSplitRuleUseCase } from './update-split-rule.use-case';
export declare class UpdateSplitRuleController {
    private readonly updateSplitRuleUseCase;
    constructor(updateSplitRuleUseCase: UpdateSplitRuleUseCase);
    handle(request: UpdateSplitRuleRequest, authorization?: string): Promise<{
        status: string;
        message: string;
        data: {
            splitRule: Record<string, unknown>;
        };
    }>;
    private resolveToken;
}
