export declare class CalculatePaymentSplitDtoIn {
    readonly splitRuleId: string;
    readonly grossAmount: number;
    readonly gatewayFeeAmount: number | null;
    readonly netAmount: number | null;
    readonly currency: string;
    readonly metadata: Record<string, unknown> | null;
    constructor(splitRuleId: string, grossAmount: number, gatewayFeeAmount: number | null, netAmount: number | null, currency: string, metadata: Record<string, unknown> | null);
}
