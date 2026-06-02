import type { SubscriptionPlanEntity } from './subscription-plan.entity';

export type SubscriptionPlanRow = {
  id: number;
  _id: string;

  officeId: string;
  clientId: string;

  gatewayId: string | null;
  apiCredentialId: string | null;
  gatewayPlanId: string | null;

  name: string;
  slug: string;
  description: string | null;

  billingInterval: string;
  billingIntervalCount: number;

  amount: number;
  currency: string;

  trialDays: number | null;
  maxBillingCycles: number | null;

  paymentMethods: string[] | null;
  metadata: Record<string, unknown> | null;
  config: Record<string, unknown> | null;
  changesHistory: Array<Record<string, unknown>> | null;

  status: string;

  createdAt: string | null;
  updatedAt: string | null;
};

export interface ISubscriptionPlansRepository {
  create(entity: SubscriptionPlanEntity): Promise<SubscriptionPlanEntity>;

  updateByUniqueId(
    _id: string,
    data: Record<string, unknown>,
  ): Promise<SubscriptionPlanRow>;

  findByUniqueId(_id: string): Promise<SubscriptionPlanRow | null>;

  findBySlugAndOfficeId(params: {
    slug: string;
    officeId: string;
  }): Promise<SubscriptionPlanRow | null>;

  getAll(): Promise<SubscriptionPlanRow[]>;

  getAllByOfficeId(officeId: string): Promise<SubscriptionPlanRow[]>;
}
