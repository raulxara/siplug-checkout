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
    updateByUniqueId(_id: string, data: Partial<{
        office_id: string | null;
        client_id: string | null;
        gateway_id: string | null;
        api_credential_id: string | null;
        name: string | null;
        slug: string | null;
        description: string | null;
        billing_interval: string | null;
        billing_interval_count: number | null;
        amount: number | null;
        currency: string | null;
        trial_days: number | null;
        max_billing_cycles: number | null;
        gateway_plan_id: string | null;
        payment_methods: string[] | null;
        metadata: Record<string, unknown> | null;
        config: Record<string, unknown> | null;
        status: string | null;
        changes_history: unknown;
    }>): Promise<SubscriptionPlanRow>;
    findByUniqueId(_id: string): Promise<SubscriptionPlanRow | null>;
    findBySlugAndOfficeId(params: {
        slug: string;
        officeId: string;
    }): Promise<SubscriptionPlanRow | null>;
    getAll(): Promise<SubscriptionPlanRow[]>;
    getAllByOfficeId(officeId: string): Promise<SubscriptionPlanRow[]>;
}
