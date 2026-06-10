import { PrismaService } from '../../../infra/database/prisma/prisma.service';
import { SplitRuleRecipientEntity } from '../entities/split-rule-recipient.entity';
import type { ISplitRuleRecipientsRepository, SplitRuleRecipientRow } from '../entities/split-rule-recipients-repository.interface';
export declare class SplitRuleRecipientsRepository implements ISplitRuleRecipientsRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(entity: SplitRuleRecipientEntity): Promise<SplitRuleRecipientEntity>;
    updateByUniqueId(_id: string, data: Record<string, unknown>): Promise<SplitRuleRecipientRow>;
    findByUniqueId(_id: string): Promise<SplitRuleRecipientRow | null>;
    findByRuleIdAndRecipientId(splitRuleId: string, splitRecipientId: string): Promise<SplitRuleRecipientRow | null>;
    getAllBySplitRuleId(splitRuleId: string): Promise<SplitRuleRecipientRow[]>;
    private toRow;
    private parseJsonObject;
    private parseChangesHistory;
}
