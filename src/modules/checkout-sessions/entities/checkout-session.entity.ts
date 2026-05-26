import { AbstractEntity } from '../../../shared/entities/abstract.entity';
import type { ICheckoutSessionsRepository } from './checkout-sessions-repository.interface';

export class CheckoutSessionEntity extends AbstractEntity {
  public officeId!: string;
  public clientId!: string;
  public paymentCustomerId: string | null = null;
  public gatewayId!: string;
  public apiCredentialId: string | null = null;

  public code: string | null = null;
  public externalReference: string | null = null;
  public idempotencyKey: string | null = null;

  public paymentType!: string;
  public amount!: number;
  public currency!: string;
  public description: string | null = null;

  public successUrl: string | null = null;
  public cancelUrl: string | null = null;
  public expiresAt: string | null = null;

  public metadata: Record<string, unknown> | null = null;
  public config: Record<string, unknown> | null = null;
  public changesHistory: Array<Record<string, unknown>> | null = null;

  constructor(private readonly repository: ICheckoutSessionsRepository) {
    super();
  }

  async create(): Promise<CheckoutSessionEntity> {
    const fresh = await this.repository.create(this);

    this.hydrate({
      id: fresh.id,
      _id: fresh._id,
      officeId: fresh.officeId,
      clientId: fresh.clientId,
      paymentCustomerId: fresh.paymentCustomerId,
      gatewayId: fresh.gatewayId,
      apiCredentialId: fresh.apiCredentialId,
      code: fresh.code,
      externalReference: fresh.externalReference,
      idempotencyKey: fresh.idempotencyKey,
      paymentType: fresh.paymentType,
      amount: fresh.amount,
      currency: fresh.currency,
      description: fresh.description,
      successUrl: fresh.successUrl,
      cancelUrl: fresh.cancelUrl,
      expiresAt: fresh.expiresAt,
      metadata: fresh.metadata,
      config: fresh.config,
      changesHistory: fresh.changesHistory,
      status: fresh.status,
      createdAt: fresh.createdAt,
      updatedAt: fresh.updatedAt,
    });

    return this;
  }
}
