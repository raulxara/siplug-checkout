import { AbstractEntity } from '../../../shared/entities/abstract.entity';
import type { ISubscriptionsRepository } from './subscriptions-repository.interface';
export declare class SubscriptionEntity extends AbstractEntity {
    private readonly repository;
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
    constructor(repository: ISubscriptionsRepository);
    create(): Promise<SubscriptionEntity>;
}
