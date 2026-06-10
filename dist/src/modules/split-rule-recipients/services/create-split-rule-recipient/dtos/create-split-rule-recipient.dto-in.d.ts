export declare class CreateSplitRuleRecipientDtoIn {
    readonly splitRuleId: string;
    readonly splitRecipientId: string;
    readonly role: string;
    readonly percentage: number | null;
    readonly fixedAmount: number | null;
    readonly liableForGatewayFee: boolean;
    readonly liableForRefund: boolean;
    readonly priority: number;
    readonly metadata: Record<string, unknown> | null;
    readonly config: Record<string, unknown> | null;
    readonly status: string;
    constructor(splitRuleId: string, splitRecipientId: string, role: string, percentage: number | null, fixedAmount: number | null, liableForGatewayFee: boolean, liableForRefund: boolean, priority: number, metadata: Record<string, unknown> | null, config: Record<string, unknown> | null, status: string);
}
