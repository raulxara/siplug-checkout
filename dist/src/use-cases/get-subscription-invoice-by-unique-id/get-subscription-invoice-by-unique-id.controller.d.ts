import { GetSubscriptionInvoiceByUniqueIdRequest } from './http/get-subscription-invoice-by-unique-id.request';
import { GetSubscriptionInvoiceByUniqueIdUseCase } from './get-subscription-invoice-by-unique-id.use-case';
export declare class GetSubscriptionInvoiceByUniqueIdController {
    private readonly getSubscriptionInvoiceByUniqueIdUseCase;
    constructor(getSubscriptionInvoiceByUniqueIdUseCase: GetSubscriptionInvoiceByUniqueIdUseCase);
    handle(request: GetSubscriptionInvoiceByUniqueIdRequest, authorization?: string): Promise<{
        status: string;
        message: string;
        data: {
            subscriptionInvoice: Record<string, unknown>;
        };
    }>;
    private resolveToken;
}
