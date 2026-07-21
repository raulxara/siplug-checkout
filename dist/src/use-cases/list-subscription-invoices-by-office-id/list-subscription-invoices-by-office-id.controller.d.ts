import { ListSubscriptionInvoicesByOfficeIdRequest } from './http/list-subscription-invoices-by-office-id.request';
import { ListSubscriptionInvoicesByOfficeIdUseCase } from './list-subscription-invoices-by-office-id.use-case';
export declare class ListSubscriptionInvoicesByOfficeIdController {
    private readonly listSubscriptionInvoicesByOfficeIdUseCase;
    constructor(listSubscriptionInvoicesByOfficeIdUseCase: ListSubscriptionInvoicesByOfficeIdUseCase);
    handle(request: ListSubscriptionInvoicesByOfficeIdRequest, authorization?: string): Promise<{
        status: string;
        message: string;
        data: {
            subscriptionInvoices: Record<string, unknown>[];
        };
    }>;
    private resolveToken;
}
