import type { SplitRuleRecipientEntity } from './split-rule-recipient.entity';
export type SplitRuleRecipientRow = {
    id: number;
    _id: string;
    splitRuleId: string;
    splitRecipientId: string;
    role: string;
    percentage: number | null;
    fixedAmount: number | null;
    liableForGatewayFee: boolean;
    liableForRefund: boolean;
    priority: number;
    metadata: Record<string, unknown> | null;
    config: Record<string, unknown> | null;
    changesHistory: Array<Record<string, unknown>> | null;
    status: string;
    createdAt: string | null;
    updatedAt: string | null;
};
export interface ISplitRuleRecipientsRepository {
    create(entity: SplitRuleRecipientEntity): Promise<SplitRuleRecipientEntity>;
    updateByUniqueId(_id: string, data: Record<string, unknown>): Promise<SplitRuleRecipientRow>;
    findByUniqueId(_id: string): Promise<SplitRuleRecipientRow | null>;
    findByRuleIdAndRecipientId(splitRuleId: string, splitRecipientId: string): Promise<SplitRuleRecipientRow | null>;
    getAllBySplitRuleId(splitRuleId: string): Promise<SplitRuleRecipientRow[]>;
}
