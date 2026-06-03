import { GenerateSubscriptionInvoiceRequest } from './http/generate-subscription-invoice.request';
import { GenerateSubscriptionInvoiceUseCase } from './generate-subscription-invoice.use-case';
export declare class GenerateSubscriptionInvoiceController {
    private readonly generateSubscriptionInvoiceUseCase;
    constructor(generateSubscriptionInvoiceUseCase: GenerateSubscriptionInvoiceUseCase);
    handle(authorization: string | undefined, body: GenerateSubscriptionInvoiceRequest): Promise<Record<string, unknown>>;
    private extractBearerToken;
}
