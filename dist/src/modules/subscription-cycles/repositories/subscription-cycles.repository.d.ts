import { PrismaService } from '../../../infra/database/prisma/prisma.service';
import { SubscriptionCycleEntity } from '../entities/subscription-cycle.entity';
import type { ISubscriptionCyclesRepository, SubscriptionCycleRow } from '../entities/subscription-cycles-repository.interface';
export declare class SubscriptionCyclesRepository implements ISubscriptionCyclesRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(entity: SubscriptionCycleEntity): Promise<SubscriptionCycleEntity>;
    updateByUniqueId(_id: string, data: Record<string, unknown>): Promise<SubscriptionCycleRow>;
    findByUniqueId(_id: string): Promise<SubscriptionCycleRow | null>;
    findBySubscriptionIdAndCycleNumber(params: {
        subscriptionId: string;
        cycleNumber: number;
    }): Promise<SubscriptionCycleRow | null>;
    getAllBySubscriptionId(subscriptionId: string): Promise<SubscriptionCycleRow[]>;
    private hydrateEntityFromModel;
    private toRow;
    private parseJsonObject;
    private parseChangesHistory;
    private toNullableDate;
}
