import type { CheckoutSessionEntity } from '../../../entities/checkout-session.entity';

export class CreateCheckoutSessionDtoOut {
  constructor(
    public readonly id: number,
    public readonly _id: string,
    public readonly officeId: string,
    public readonly clientId: string,
    public readonly paymentCustomerId: string | null,
    public readonly gatewayId: string,
    public readonly apiCredentialId: string | null,
    public readonly code: string | null,
    public readonly externalReference: string | null,
    public readonly idempotencyKey: string | null,
    public readonly paymentType: string,
    public readonly amount: number,
    public readonly currency: string,
    public readonly description: string | null,
    public readonly successUrl: string | null,
    public readonly cancelUrl: string | null,
    public readonly expiresAt: string | null,
    public readonly metadata: Record<string, unknown> | null,
    public readonly config: Record<string, unknown> | null,
    public readonly changesHistory: Array<Record<string, unknown>> | null,
    public readonly status: string,
    public readonly createdAt: string | null,
    public readonly updatedAt: string | null,
  ) {}

  static fromEntity(entity: CheckoutSessionEntity): CreateCheckoutSessionDtoOut {
    return new CreateCheckoutSessionDtoOut(
      entity.id ?? 0,
      entity._id ?? '',
      entity.officeId,
      entity.clientId,
      entity.paymentCustomerId,
      entity.gatewayId,
      entity.apiCredentialId,
      entity.code,
      entity.externalReference,
      entity.idempotencyKey,
      entity.paymentType,
      entity.amount,
      entity.currency,
      entity.description,
      entity.successUrl,
      entity.cancelUrl,
      entity.expiresAt,
      entity.metadata,
      entity.config,
      entity.changesHistory,
      entity.status ?? 'created',
      entity.createdAt,
      entity.updatedAt,
    );
  }
}