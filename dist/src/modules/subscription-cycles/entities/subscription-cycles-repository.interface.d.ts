import type { SubscriptionCycleEntity } from './subscription-cycle.entity';
export type SubscriptionCycleRow = {
    id: number;
    _id: string;
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
    status: string;
    createdAt: string | null;
    updatedAt: string | null;
};
export interface ISubscriptionCyclesRepository {
    create(entity: SubscriptionCycleEntity): Promise<SubscriptionCycleEntity>;
    updateByUniqueId(_id: string, data: Record<string, unknown>): Promise<SubscriptionCycleRow>;
    findByUniqueId(_id: string): Promise<SubscriptionCycleRow | null>;
    findBySubscriptionIdAndCycleNumber(params: {
        subscriptionId: string;
        cycleNumber: number;
    }): Promise<SubscriptionCycleRow | null>;
    getAllBySubscriptionId(subscriptionId: string): Promise<SubscriptionCycleRow[]>;
}
