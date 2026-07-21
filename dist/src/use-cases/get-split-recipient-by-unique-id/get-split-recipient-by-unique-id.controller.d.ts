import { GetSplitRecipientByUniqueIdRequest } from './http/get-split-recipient-by-unique-id.request';
import { GetSplitRecipientByUniqueIdUseCase } from './get-split-recipient-by-unique-id.use-case';
export declare class GetSplitRecipientByUniqueIdController {
    private readonly getSplitRecipientByUniqueIdUseCase;
    constructor(getSplitRecipientByUniqueIdUseCase: GetSplitRecipientByUniqueIdUseCase);
    handle(request: GetSplitRecipientByUniqueIdRequest, authorization?: string): Promise<{
        status: string;
        message: string;
        data: {
            splitRecipient: Record<string, unknown>;
        };
    }>;
    private resolveToken;
}
