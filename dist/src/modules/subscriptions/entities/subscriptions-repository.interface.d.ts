import type { SubscriptionEntity } from './subscription.entity';
export type SubscriptionRow = {
    id: number;
    _id: string;
    officeId: string;
    clientId: string;
    subscriptionPlanId: string | null;
    paymentCustomerId: string;
    gatewayId: string | null;
    apiCredentialId: string | null;
    gatewaySubscriptionId: string | null;
    externalReference: string | null;
    amount: number;
    currency: string;
    currentCycle: number;
    nextBillingAt: string | null;
    startedAt: string | null;
    canceledAt: string | null;
    endedAt: string | null;
    metadata: Record<string, unknown> | null;
    config: Record<string, unknown> | null;
    changesHistory: Array<Record<string, unknown>> | null;
    status: string;
    createdAt: string | null;
    updatedAt: string | null;
};
export interface ISubscriptionsRepository {
    create(entity: SubscriptionEntity): Promise<SubscriptionEntity>;
    updateByUniqueId(_id: string, data: Record<string, unknown>): Promise<SubscriptionRow>;
    findByUniqueId(_id: string): Promise<SubscriptionRow | null>;
    findByExternalReferenceAndOfficeId(params: {
        externalReference: string;
        officeId: string;
    }): Promise<SubscriptionRow | null>;
    getAll(): Promise<SubscriptionRow[]>;
    getAllByOfficeId(officeId: string): Promise<SubscriptionRow[]>;
}
