export type UpdateCheckoutSessionItemInput = {
  checkoutSessionItemId: string;

  itemRef?: string | null;
  itemType?: string | null;
  name?: string | null;
  description?: string | null;

  quantity?: number | null;
  unitAmount?: number | null;
  totalAmount?: number | null;

  metadata?: Record<string, unknown> | null;
  config?: Record<string, unknown> | null;

  status?: string | null;
};

export class UpdateCheckoutSessionDtoIn {
  public readonly token: string;
  public readonly checkoutSessionId: string;

  public readonly officeId: string | null;
  public readonly clientId: string | null;
  public readonly paymentCustomerId: string | null;
  public readonly gatewayId: string | null;
  public readonly apiCredentialId: string | null;

  public readonly code: string | null;
  public readonly externalReference: string | null;
  public readonly idempotencyKey: string | null;

  public readonly paymentType: string | null;
  public readonly amount: number | null;
  public readonly currency: string | null;
  public readonly description: string | null;

  public readonly successUrl: string | null;
  public readonly cancelUrl: string | null;
  public readonly expiresAt: string | null;

  public readonly items: UpdateCheckoutSessionItemInput[];

  public readonly metadata: Record<string, unknown> | null;
  public readonly config: Record<string, unknown> | null;

  public readonly status: string | null;
  public readonly source: string;

  constructor(params: {
    token?: string;
    checkoutSessionId?: string;

    officeId?: string | null;
    clientId?: string | null;
    paymentCustomerId?: string | null;
    gatewayId?: string | null;
    apiCredentialId?: string | null;

    code?: string | null;
    externalReference?: string | null;
    idempotencyKey?: string | null;

    paymentType?: string | null;
    amount?: number | null;
    currency?: string | null;
    description?: string | null;

    successUrl?: string | null;
    cancelUrl?: string | null;
    expiresAt?: string | null;

    items?: UpdateCheckoutSessionItemInput[];

    metadata?: Record<string, unknown> | null;
    config?: Record<string, unknown> | null;

    status?: string | null;
    source?: string;
  }) {
    this.token = params.token ?? '';
    this.checkoutSessionId = params.checkoutSessionId ?? '';

    this.officeId = params.officeId ?? null;
    this.clientId = params.clientId ?? null;
    this.paymentCustomerId = params.paymentCustomerId ?? null;
    this.gatewayId = params.gatewayId ?? null;
    this.apiCredentialId = params.apiCredentialId ?? null;

    this.code = params.code ?? null;
    this.externalReference = params.externalReference ?? null;
    this.idempotencyKey = params.idempotencyKey ?? null;

    this.paymentType = params.paymentType ?? null;
    this.amount = params.amount ?? null;
    this.currency = params.currency ?? null;
    this.description = params.description ?? null;

    this.successUrl = params.successUrl ?? null;
    this.cancelUrl = params.cancelUrl ?? null;
    this.expiresAt = params.expiresAt ?? null;

    this.items = params.items ?? [];

    this.metadata = params.metadata ?? null;
    this.config = params.config ?? null;

    this.status = params.status ?? null;
    this.source = params.source ?? 'UpdateCheckoutSessionUseCase';

    if (this.token.trim() === '') {
      throw new Error('token is required');
    }

    if (this.checkoutSessionId.trim() === '') {
      throw new Error('checkoutSessionId is required');
    }

    if (this.amount !== null) {
      if (!Number.isInteger(this.amount) || this.amount <= 0) {
        throw new Error('amount must be an integer greater than zero');
      }
    }

    for (const item of this.items) {
      if (!item.checkoutSessionItemId || item.checkoutSessionItemId.trim() === '') {
        throw new Error('item.checkoutSessionItemId is required');
      }

      if (item.quantity !== undefined && item.quantity !== null) {
        if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
          throw new Error('item.quantity must be an integer greater than zero');
        }
      }

      if (item.unitAmount !== undefined && item.unitAmount !== null) {
        if (!Number.isInteger(item.unitAmount) || item.unitAmount <= 0) {
          throw new Error('item.unitAmount must be an integer greater than zero');
        }
      }

      if (item.totalAmount !== undefined && item.totalAmount !== null) {
        if (!Number.isInteger(item.totalAmount) || item.totalAmount <= 0) {
          throw new Error('item.totalAmount must be an integer greater than zero');
        }
      }
    }
  }
}
