import type { CheckoutSessionRow } from '../../../modules/checkout-sessions/entities/checkout-sessions-repository.interface';
import type { PaymentTransactionRow } from '../../../modules/payment-transactions/entities/payment-transactions-repository.interface';

export class ReceiveGatewayWebhookDtoOut {
  constructor(
    public readonly eventType: string,
    public readonly processed: boolean,
    public readonly paymentTransaction: PaymentTransactionRow | null,
    public readonly checkoutSession: CheckoutSessionRow | null,
  ) {}
}
