import { ListSplitRecipientsByOfficeIdRequest } from './http/list-split-recipients-by-office-id.request';
import { ListSplitRecipientsByOfficeIdUseCase } from './list-split-recipients-by-office-id.use-case';
export declare class ListSplitRecipientsByOfficeIdController {
    private readonly listSplitRecipientsByOfficeIdUseCase;
    constructor(listSplitRecipientsByOfficeIdUseCase: ListSplitRecipientsByOfficeIdUseCase);
    handle(request: ListSplitRecipientsByOfficeIdRequest, authorization?: string): Promise<{
        status: string;
        message: string;
        data: {
            splitRecipients: Record<string, unknown>[];
        };
    }>;
    private resolveToken;
}
