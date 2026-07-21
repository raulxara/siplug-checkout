import type { SubscriptionCycleRow } from '../../../modules/subscription-cycles/entities/subscription-cycles-repository.interface';
import type { SubscriptionInvoiceRow } from '../../../modules/subscription-invoices/entities/subscription-invoices-repository.interface';
import type { SubscriptionRow } from '../../../modules/subscriptions/entities/subscriptions-repository.interface';
export declare class GenerateSubscriptionInvoiceDtoOut {
    readonly subscription: SubscriptionRow;
    readonly subscriptionCycle: SubscriptionCycleRow;
    readonly subscriptionInvoice: SubscriptionInvoiceRow;
    constructor(subscription: SubscriptionRow, subscriptionCycle: SubscriptionCycleRow, subscriptionInvoice: SubscriptionInvoiceRow);
}
