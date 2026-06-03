import type { CheckoutSessionRow } from '../../../modules/checkout-sessions/entities/checkout-sessions-repository.interface';
import type { PaymentTransactionRow } from '../../../modules/payment-transactions/entities/payment-transactions-repository.interface';
export declare class ReceiveGatewayWebhookDtoOut {
    readonly eventType: string;
    readonly processed: boolean;
    readonly paymentTransaction: PaymentTransactionRow | null;
    readonly checkoutSession: CheckoutSessionRow | null;
    constructor(eventType: string, processed: boolean, paymentTransaction: PaymentTransactionRow | null, checkoutSession: CheckoutSessionRow | null);
}
