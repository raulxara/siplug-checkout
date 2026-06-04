import type { SubscriptionInvoiceRow } from '../../../entities/subscription-invoices-repository.interface';
export declare class FindSubscriptionInvoiceByUniqueIdDtoOut {
    readonly subscriptionInvoice: SubscriptionInvoiceRow;
    constructor(subscriptionInvoice: SubscriptionInvoiceRow);
}
