export declare class SyncSplitRuleRecipientsDtoOut {
    readonly splitRule: Record<string, unknown>;
    readonly splitRuleRecipients: Array<Record<string, unknown>>;
    readonly createdCount: number;
    readonly updatedCount: number;
    readonly inactivatedCount: number;
    constructor(splitRule: Record<string, unknown>, splitRuleRecipients: Array<Record<string, unknown>>, createdCount: number, updatedCount: number, inactivatedCount: number);
}
