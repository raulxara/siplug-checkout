import type { PaymentTransactionRow } from '../../../modules/payment-transactions/entities/payment-transactions-repository.interface';
import type { CheckoutSessionRow } from '../../../modules/checkout-sessions/entities/checkout-sessions-repository.interface';
export declare class ReceiveGatewayWebhookDtoOut {
    readonly provider: string;
    readonly eventType: string | null;
    readonly eventAction: string | null;
    readonly gatewayTransactionId: string | null;
    readonly ignored: boolean;
    readonly paymentTransaction: PaymentTransactionRow | null;
    readonly checkoutSession: CheckoutSessionRow | null;
    constructor(provider: string, eventType: string | null, eventAction: string | null, gatewayTransactionId: string | null, ignored: boolean, paymentTransaction: PaymentTransactionRow | null, checkoutSession: CheckoutSessionRow | null);
}
