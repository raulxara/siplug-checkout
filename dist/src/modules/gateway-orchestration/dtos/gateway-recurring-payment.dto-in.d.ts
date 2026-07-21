import type { PaymentTransactionRow } from '../../payment-transactions/entities/payment-transactions-repository.interface';
import type { SubscriptionInvoiceRow } from '../../subscription-invoices/entities/subscription-invoices-repository.interface';
import type { SubscriptionPlanRow } from '../../subscription-plans/entities/subscription-plans-repository.interface';
import type { SubscriptionRow } from '../../subscriptions/entities/subscriptions-repository.interface';
export type GatewayRecurringApiCredentialData = {
    _id: string;
    slug: string;
    gatewayId: string | null;
    token: string | null;
    config: Record<string, unknown> | null;
    connectionData: Record<string, unknown> | null;
};
export declare class GatewayRecurringPaymentDtoIn {
    readonly gatewayProvider: string;
    readonly gatewaySlug: string;
    readonly subscriptionPlan: SubscriptionPlanRow;
    readonly subscription: SubscriptionRow;
    readonly subscriptionInvoice: SubscriptionInvoiceRow;
    readonly paymentTransaction: PaymentTransactionRow;
    readonly apiCredential: GatewayRecurringApiCredentialData;
    readonly providerPayload: Record<string, unknown>;
    readonly idempotencyKey: string | null;
    readonly config: {
        gatewayConfig?: Record<string, unknown> | null;
        transactionConfig?: Record<string, unknown> | null;
        apiCredentialConfig?: Record<string, unknown> | null;
        subscriptionPlanConfig?: Record<string, unknown> | null;
        subscriptionConfig?: Record<string, unknown> | null;
        subscriptionInvoiceConfig?: Record<string, unknown> | null;
        checkoutSessionConfig?: Record<string, unknown> | null;
    };
    constructor(params: {
        gatewayProvider: string;
        gatewaySlug: string;
        subscriptionPlan: SubscriptionPlanRow;
        subscription: SubscriptionRow;
        subscriptionInvoice: SubscriptionInvoiceRow;
        paymentTransaction: PaymentTransactionRow;
        apiCredential: GatewayRecurringApiCredentialData;
        providerPayload: Record<string, unknown>;
        idempotencyKey: string | null;
        config?: {
            gatewayConfig?: Record<string, unknown> | null;
            transactionConfig?: Record<string, unknown> | null;
            apiCredentialConfig?: Record<string, unknown> | null;
            subscriptionPlanConfig?: Record<string, unknown> | null;
            subscriptionConfig?: Record<string, unknown> | null;
            subscriptionInvoiceConfig?: Record<string, unknown> | null;
            checkoutSessionConfig?: Record<string, unknown> | null;
        };
    });
}
