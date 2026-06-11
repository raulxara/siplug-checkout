import { ListPaymentSplitsByOfficeIdRequest } from './http/list-payment-splits-by-office-id.request';
import { ListPaymentSplitsByOfficeIdUseCase } from './list-payment-splits-by-office-id.use-case';
export declare class ListPaymentSplitsByOfficeIdController {
    private readonly listPaymentSplitsByOfficeIdUseCase;
    constructor(listPaymentSplitsByOfficeIdUseCase: ListPaymentSplitsByOfficeIdUseCase);
    handle(request: ListPaymentSplitsByOfficeIdRequest, authorization?: string): Promise<{
        status: string;
        message: string;
        data: {
            paymentSplits: {
                paymentSplit: Record<string, unknown>;
                paymentSplitRecipients: Array<Record<string, unknown>>;
            }[];
        };
    }>;
    private resolveToken;
}
