import { UpdateSubscriptionInvoiceRequest } from './http/update-subscription-invoice.request';
import { UpdateSubscriptionInvoiceUseCase } from './update-subscription-invoice.use-case';
export declare class UpdateSubscriptionInvoiceController {
    private readonly updateSubscriptionInvoiceUseCase;
    constructor(updateSubscriptionInvoiceUseCase: UpdateSubscriptionInvoiceUseCase);
    handle(request: UpdateSubscriptionInvoiceRequest, authorization?: string): Promise<{
        status: string;
        message: string;
        data: {
            subscriptionInvoice: Record<string, unknown>;
        };
    }>;
    private resolveToken;
}
