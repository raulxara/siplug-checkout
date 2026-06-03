import { AbstractEntity } from '../../../shared/entities/abstract.entity';
import type { ISubscriptionCyclesRepository } from './subscription-cycles-repository.interface';
export declare class SubscriptionCycleEntity extends AbstractEntity {
    private readonly repository;
    subscriptionId: string;
    cycleNumber: number;
    amount: number;
    currency: string;
    periodStart: string | null;
    periodEnd: string | null;
    scheduledAt: string | null;
    processedAt: string | null;
    metadata: Record<string, unknown> | null;
    config: Record<string, unknown> | null;
    changesHistory: Array<Record<string, unknown>> | null;
    constructor(repository: ISubscriptionCyclesRepository);
    create(): Promise<SubscriptionCycleEntity>;
}
