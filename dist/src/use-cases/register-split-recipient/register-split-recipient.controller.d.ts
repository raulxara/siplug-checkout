import { RegisterSplitRecipientRequest } from './http/register-split-recipient.request';
import { RegisterSplitRecipientUseCase } from './register-split-recipient.use-case';
export declare class RegisterSplitRecipientController {
    private readonly registerSplitRecipientUseCase;
    constructor(registerSplitRecipientUseCase: RegisterSplitRecipientUseCase);
    handle(request: RegisterSplitRecipientRequest, authorization?: string): Promise<{
        status: string;
        message: string;
        data: {
            splitRecipient: Record<string, unknown>;
        };
    }>;
    private resolveToken;
}
