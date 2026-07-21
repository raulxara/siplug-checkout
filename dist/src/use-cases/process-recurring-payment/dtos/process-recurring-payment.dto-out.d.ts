import type { PaymentTransactionRow } from '../../../modules/payment-transactions/entities/payment-transactions-repository.interface';
import type { SubscriptionCycleRow } from '../../../modules/subscription-cycles/entities/subscription-cycles-repository.interface';
import type { SubscriptionInvoiceRow } from '../../../modules/subscription-invoices/entities/subscription-invoices-repository.interface';
import type { SubscriptionRow } from '../../../modules/subscriptions/entities/subscriptions-repository.interface';
export declare class ProcessRecurringPaymentDtoOut {
    readonly subscription: SubscriptionRow;
    readonly subscriptionCycle: SubscriptionCycleRow;
    readonly subscriptionInvoice: SubscriptionInvoiceRow;
    readonly paymentTransaction: PaymentTransactionRow;
    readonly checkoutSession: Record<string, unknown> | null;
    constructor(subscription: SubscriptionRow, subscriptionCycle: SubscriptionCycleRow, subscriptionInvoice: SubscriptionInvoiceRow, paymentTransaction: PaymentTransactionRow, checkoutSession: Record<string, unknown> | null);
}
