import { AbstractEntity } from '../../../shared/entities/abstract.entity';
import type { ISubscriptionsRepository } from './subscriptions-repository.interface';

export class SubscriptionEntity extends AbstractEntity {
  public officeId!: string;
  public clientId!: string;

  public subscriptionPlanId: string | null = null;
  public paymentCustomerId!: string;

  public gatewayId: string | null = null;
  public apiCredentialId: string | null = null;

  public gatewaySubscriptionId: string | null = null;
  public externalReference: string | null = null;

  public amount!: number;
  public currency!: string;

  public currentCycle = 0;

  public nextBillingAt: string | null = null;
  public startedAt: string | null = null;
  public canceledAt: string | null = null;
  public endedAt: string | null = null;

  public metadata: Record<string, unknown> | null = null;
  public config: Record<string, unknown> | null = null;
  public changesHistory: Array<Record<string, unknown>> | null = null;

  constructor(private readonly repository: ISubscriptionsRepository) {
    super();
  }

  async create(): Promise<SubscriptionEntity> {
    const fresh = await this.repository.create(this);

    this.hydrate({
      id: fresh.id,
      _id: fresh._id,

      officeId: fresh.officeId,
      clientId: fresh.clientId,

      subscriptionPlanId: fresh.subscriptionPlanId,
      paymentCustomerId: fresh.paymentCustomerId,

      gatewayId: fresh.gatewayId,
      apiCredentialId: fresh.apiCredentialId,

      gatewaySubscriptionId: fresh.gatewaySubscriptionId,
      externalReference: fresh.externalReference,

      amount: fresh.amount,
      currency: fresh.currency,

      currentCycle: fresh.currentCycle,

      nextBillingAt: fresh.nextBillingAt,
      startedAt: fresh.startedAt,
      canceledAt: fresh.canceledAt,
      endedAt: fresh.endedAt,

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