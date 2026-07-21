import type { SplitRuleEntity } from './split-rule.entity';
export type SplitRuleRow = {
    id: number;
    _id: string;
    officeId: string;
    clientId: string;
    gatewayId: string | null;
    name: string;
    slug: string;
    description: string | null;
    splitType: string;
    calculationBase: string;
    priority: number;
    metadata: Record<string, unknown> | null;
    config: Record<string, unknown> | null;
    changesHistory: Array<Record<string, unknown>> | null;
    status: string;
    createdAt: string | null;
    updatedAt: string | null;
};
export interface ISplitRulesRepository {
    create(entity: SplitRuleEntity): Promise<SplitRuleEntity>;
    updateByUniqueId(_id: string, data: Record<string, unknown>): Promise<SplitRuleRow>;
    findByUniqueId(_id: string): Promise<SplitRuleRow | null>;
    findByOfficeIdAndSlug(officeId: string, slug: string): Promise<SplitRuleRow | null>;
    getAll(): Promise<SplitRuleRow[]>;
    getAllByOfficeId(officeId: string): Promise<SplitRuleRow[]>;
}
