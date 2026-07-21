import { PrismaService } from '../../../infra/database/prisma/prisma.service';
import { SplitRecipientEntity } from '../entities/split-recipient.entity';
import type { ISplitRecipientsRepository, SplitRecipientRow } from '../entities/split-recipients-repository.interface';
export declare class SplitRecipientsRepository implements ISplitRecipientsRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(entity: SplitRecipientEntity): Promise<SplitRecipientEntity>;
    updateByUniqueId(_id: string, data: Record<string, unknown>): Promise<SplitRecipientRow>;
    findByUniqueId(_id: string): Promise<SplitRecipientRow | null>;
    findByGatewayRecipientId(gatewayProvider: string, gatewayRecipientId: string): Promise<SplitRecipientRow | null>;
    getAll(): Promise<SplitRecipientRow[]>;
    getAllByOfficeId(officeId: string): Promise<SplitRecipientRow[]>;
    private toRow;
    private parseJsonObject;
    private parseChangesHistory;
}
