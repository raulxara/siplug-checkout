import type { SubscriptionInvoiceRow } from '../../../entities/subscription-invoices-repository.interface';
export declare class CreateSubscriptionInvoiceDtoOut {
    readonly subscriptionInvoice: SubscriptionInvoiceRow;
    constructor(subscriptionInvoice: SubscriptionInvoiceRow);
}
