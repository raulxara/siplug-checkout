export type SyncSplitRuleRecipientItemDtoIn = {
    splitRecipientId: string;
    role: string;
    percentage: number | null;
    fixedAmount: number | null;
    liableForGatewayFee: boolean;
    liableForRefund: boolean;
    priority: number;
    metadata: Record<string, unknown> | null;
    config: Record<string, unknown> | null;
    status: string;
};
export declare class SyncSplitRuleRecipientsDtoIn {
    readonly token: string;
    readonly splitRuleId: string;
    readonly recipients: SyncSplitRuleRecipientItemDtoIn[];
    constructor(params: {
        token?: unknown;
        splitRuleId?: unknown;
        recipients?: unknown;
    });
    private parseRecipient;
    private validateRuleComposition;
    private toNullableString;
    private toNullableNumber;
    private toNumber;
    private toBoolean;
    private toNullableObject;
}
