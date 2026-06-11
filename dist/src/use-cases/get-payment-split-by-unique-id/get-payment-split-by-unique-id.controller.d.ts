import { GetPaymentSplitByUniqueIdRequest } from './http/get-payment-split-by-unique-id.request';
import { GetPaymentSplitByUniqueIdUseCase } from './get-payment-split-by-unique-id.use-case';
export declare class GetPaymentSplitByUniqueIdController {
    private readonly getPaymentSplitByUniqueIdUseCase;
    constructor(getPaymentSplitByUniqueIdUseCase: GetPaymentSplitByUniqueIdUseCase);
    handle(request: GetPaymentSplitByUniqueIdRequest, authorization?: string): Promise<{
        status: string;
        message: string;
        data: {
            paymentSplit: Record<string, unknown>;
            paymentSplitRecipients: Record<string, unknown>[];
        };
    }>;
    private resolveToken;
}
