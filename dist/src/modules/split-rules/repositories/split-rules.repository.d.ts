import { PrismaService } from '../../../infra/database/prisma/prisma.service';
import { SplitRuleEntity } from '../entities/split-rule.entity';
import type { ISplitRulesRepository, SplitRuleRow } from '../entities/split-rules-repository.interface';
export declare class SplitRulesRepository implements ISplitRulesRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(entity: SplitRuleEntity): Promise<SplitRuleEntity>;
    updateByUniqueId(_id: string, data: Record<string, unknown>): Promise<SplitRuleRow>;
    findByUniqueId(_id: string): Promise<SplitRuleRow | null>;
    findByOfficeIdAndSlug(officeId: string, slug: string): Promise<SplitRuleRow | null>;
    getAll(): Promise<SplitRuleRow[]>;
    getAllByOfficeId(officeId: string): Promise<SplitRuleRow[]>;
    private toRow;
    private parseJsonObject;
    private parseChangesHistory;
}
