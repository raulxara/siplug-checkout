import { ListSplitRecipientsRequest } from './http/list-split-recipients.request';
import { ListSplitRecipientsUseCase } from './list-split-recipients.use-case';
export declare class ListSplitRecipientsController {
    private readonly listSplitRecipientsUseCase;
    constructor(listSplitRecipientsUseCase: ListSplitRecipientsUseCase);
    handle(request: ListSplitRecipientsRequest, authorization?: string): Promise<{
        status: string;
        message: string;
        data: {
            splitRecipients: Record<string, unknown>[];
        };
    }>;
    private resolveToken;
}
