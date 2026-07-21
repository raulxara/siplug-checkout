import { AbstractEntity } from '../../../shared/entities/abstract.entity';
import type { ISubscriptionPlansRepository } from './subscription-plans-repository.interface';

export class SubscriptionPlanEntity extends AbstractEntity {
  public officeId!: string;
  public clientId!: string;

  public gatewayId: string | null = null;
  public apiCredentialId: string | null = null;
  public gatewayPlanId: string | null = null;

  public name!: string;
  public slug!: string;
  public description: string | null = null;

  public billingInterval!: string;
  public billingIntervalCount = 1;

  public amount!: number;
  public currency!: string;

  public trialDays: number | null = null;
  public maxBillingCycles: number | null = null;

  public paymentMethods: string[] | null = null;
  public metadata: Record<string, unknown> | null = null;
  public config: Record<string, unknown> | null = null;
  public changesHistory: Array<Record<string, unknown>> | null = null;

  constructor(private readonly repository: ISubscriptionPlansRepository) {
    super();
  }

  async create(): Promise<SubscriptionPlanEntity> {
    const fresh = await this.repository.create(this);

    this.hydrate({
      id: fresh.id,
      _id: fresh._id,

      officeId: fresh.officeId,
      clientId: fresh.clientId,

      gatewayId: fresh.gatewayId,
      apiCredentialId: fresh.apiCredentialId,
      gatewayPlanId: fresh.gatewayPlanId,

      name: fresh.name,
      slug: fresh.slug,
      description: fresh.description,

      billingInterval: fresh.billingInterval,
      billingIntervalCount: fresh.billingIntervalCount,

      amount: fresh.amount,
      currency: fresh.currency,

      trialDays: fresh.trialDays,
      maxBillingCycles: fresh.maxBillingCycles,

      paymentMethods: fresh.paymentMethods,
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
