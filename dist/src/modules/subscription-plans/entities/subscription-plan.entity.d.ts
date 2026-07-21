import { AbstractEntity } from '../../../shared/entities/abstract.entity';
import type { ISubscriptionPlansRepository } from './subscription-plans-repository.interface';
export declare class SubscriptionPlanEntity extends AbstractEntity {
    private readonly repository;
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
    constructor(repository: ISubscriptionPlansRepository);
    create(): Promise<SubscriptionPlanEntity>;
}
