import { PrismaService } from '../../../infra/database/prisma/prisma.service';
import { SubscriptionEntity } from '../entities/subscription.entity';
import type { ISubscriptionsRepository, SubscriptionRow } from '../entities/subscriptions-repository.interface';
export declare class SubscriptionsRepository implements ISubscriptionsRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(entity: SubscriptionEntity): Promise<SubscriptionEntity>;
    updateByUniqueId(_id: string, data: Record<string, unknown>): Promise<SubscriptionRow>;
    findByUniqueId(_id: string): Promise<SubscriptionRow | null>;
    findByExternalReferenceAndOfficeId(params: {
        externalReference: string;
        officeId: string;
    }): Promise<SubscriptionRow | null>;
    getAll(): Promise<SubscriptionRow[]>;
    getAllByOfficeId(officeId: string): Promise<SubscriptionRow[]>;
    private hydrateEntityFromModel;
    private toRow;
    private parseJsonObject;
    private parseChangesHistory;
    private toNullableDate;
}
