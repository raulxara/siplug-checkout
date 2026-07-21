import { UpdateSplitRecipientRequest } from './http/update-split-recipient.request';
import { UpdateSplitRecipientUseCase } from './update-split-recipient.use-case';
export declare class UpdateSplitRecipientController {
    private readonly updateSplitRecipientUseCase;
    constructor(updateSplitRecipientUseCase: UpdateSplitRecipientUseCase);
    handle(request: UpdateSplitRecipientRequest, authorization?: string): Promise<{
        status: string;
        message: string;
        data: {
            splitRecipient: Record<string, unknown>;
        };
    }>;
    private resolveToken;
}
