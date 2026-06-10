export declare class UpdateSplitRuleRecipientDtoIn {
    readonly _id: string;
    readonly splitRuleId: string | null;
    readonly splitRecipientId: string | null;
    readonly role: string | null;
    readonly percentage: number | null;
    readonly fixedAmount: number | null;
    readonly liableForGatewayFee: boolean | null;
    readonly liableForRefund: boolean | null;
    readonly priority: number | null;
    readonly metadata: Record<string, unknown> | null;
    readonly config: Record<string, unknown> | null;
    readonly status: string | null;
    readonly source: string;
    constructor(_id: string, splitRuleId: string | null, splitRecipientId: string | null, role: string | null, percentage: number | null, fixedAmount: number | null, liableForGatewayFee: boolean | null, liableForRefund: boolean | null, priority: number | null, metadata: Record<string, unknown> | null, config: Record<string, unknown> | null, status: string | null, source: string);
}
