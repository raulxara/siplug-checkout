import type { PaymentTransactionRow } from '../../../modules/payment-transactions/entities/payment-transactions-repository.interface';
import type { CheckoutSessionRow } from '../../../modules/checkout-sessions/entities/checkout-sessions-repository.interface';

export class ReceiveGatewayWebhookDtoOut {
  constructor(
    public readonly provider: string,
    public readonly eventType: string | null,
    public readonly eventAction: string | null,
    public readonly gatewayTransactionId: string | null,
    public readonly ignored: boolean,
    public readonly paymentTransaction: PaymentTransactionRow | null,
    public readonly checkoutSession: CheckoutSessionRow | null,
  ) {}
}
