export class ValidateStripeWebhookDtoIn {
  public readonly rawBody: string;
  public readonly stripeSignature: string;
  public readonly endpointSecret: string;
  public readonly toleranceInSeconds: number;

  constructor(params: {
    rawBody?: unknown;
    stripeSignature?: unknown;
    endpointSecret?: unknown;
    toleranceInSeconds?: unknown;
  }) {
    this.rawBody = String(params.rawBody ?? '');
    this.stripeSignature = String(params.stripeSignature ?? '').trim();
    this.endpointSecret = String(params.endpointSecret ?? '').trim();
    this.toleranceInSeconds = Number(params.toleranceInSeconds ?? 300);

    if (this.rawBody === '') {
      throw new Error('rawBody is required for Stripe webhook validation');
    }

    if (this.stripeSignature === '') {
      throw new Error('Stripe-Signature header is required');
    }

    if (this.endpointSecret === '') {
      throw new Error('STRIPE_WEBHOOK_SECRET is required');
    }

    if (
      Number.isNaN(this.toleranceInSeconds) ||
      this.toleranceInSeconds <= 0
    ) {
      throw new Error('toleranceInSeconds must be greater than zero');
    }
  }
}
