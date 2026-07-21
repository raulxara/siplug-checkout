import { RegisterSplitRuleRequest } from './http/register-split-rule.request';
import { RegisterSplitRuleUseCase } from './register-split-rule.use-case';
export declare class RegisterSplitRuleController {
    private readonly registerSplitRuleUseCase;
    constructor(registerSplitRuleUseCase: RegisterSplitRuleUseCase);
    handle(request: RegisterSplitRuleRequest, authorization?: string): Promise<{
        status: string;
        message: string;
        data: {
            splitRule: Record<string, unknown>;
        };
    }>;
    private resolveToken;
}
