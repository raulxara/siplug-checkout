import { PrismaService } from '../../../infra/database/prisma/prisma.service';
import { SubscriptionPlanEntity } from '../entities/subscription-plan.entity';
import type { ISubscriptionPlansRepository, SubscriptionPlanRow } from '../entities/subscription-plans-repository.interface';
export declare class SubscriptionPlansRepository implements ISubscriptionPlansRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(entity: SubscriptionPlanEntity): Promise<SubscriptionPlanEntity>;
    updateByUniqueId(_id: string, data: Record<string, unknown>): Promise<SubscriptionPlanRow>;
    findByUniqueId(_id: string): Promise<SubscriptionPlanRow | null>;
    findBySlugAndOfficeId(params: {
        slug: string;
        officeId: string;
    }): Promise<SubscriptionPlanRow | null>;
    getAll(): Promise<SubscriptionPlanRow[]>;
    getAllByOfficeId(officeId: string): Promise<SubscriptionPlanRow[]>;
    private hydrateEntityFromModel;
    private toRow;
    private parseJsonObject;
    private parseStringArray;
    private parseChangesHistory;
}
