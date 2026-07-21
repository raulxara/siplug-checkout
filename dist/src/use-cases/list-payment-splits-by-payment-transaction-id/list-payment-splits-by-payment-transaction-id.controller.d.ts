import { ListPaymentSplitsByPaymentTransactionIdRequest } from './http/list-payment-splits-by-payment-transaction-id.request';
import { ListPaymentSplitsByPaymentTransactionIdUseCase } from './list-payment-splits-by-payment-transaction-id.use-case';
export declare class ListPaymentSplitsByPaymentTransactionIdController {
    private readonly listPaymentSplitsByPaymentTransactionIdUseCase;
    constructor(listPaymentSplitsByPaymentTransactionIdUseCase: ListPaymentSplitsByPaymentTransactionIdUseCase);
    handle(request: ListPaymentSplitsByPaymentTransactionIdRequest, authorization?: string): Promise<{
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
