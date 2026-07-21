import { ListSubscriptionInvoicesRequest } from './http/list-subscription-invoices.request';
import { ListSubscriptionInvoicesUseCase } from './list-subscription-invoices.use-case';
export declare class ListSubscriptionInvoicesController {
    private readonly listSubscriptionInvoicesUseCase;
    constructor(listSubscriptionInvoicesUseCase: ListSubscriptionInvoicesUseCase);
    handle(request: ListSubscriptionInvoicesRequest, authorization?: string): Promise<{
        status: string;
        message: string;
        data: {
            subscriptionInvoices: Record<string, unknown>[];
        };
    }>;
    private resolveToken;
}
