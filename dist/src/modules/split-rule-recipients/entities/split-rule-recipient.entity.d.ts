import type { ISplitRuleRecipientsRepository } from './split-rule-recipients-repository.interface';
export declare class SplitRuleRecipientEntity {
    private readonly splitRuleRecipientsRepository?;
    id: number | null;
    _id: string | null;
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
    constructor(splitRuleRecipientsRepository?: ISplitRuleRecipientsRepository | undefined);
    create(): Promise<SplitRuleRecipientEntity>;
}
