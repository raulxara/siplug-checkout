export declare class CalculatePaymentSplitDtoIn {
    readonly token: string;
    readonly splitRuleId: string;
    readonly grossAmount: number;
    readonly gatewayFeeAmount: number | null;
    readonly netAmount: number | null;
    readonly currency: string;
    readonly metadata: Record<string, unknown> | null;
    constructor(params: {
        token?: unknown;
        splitRuleId?: unknown;
        grossAmount?: unknown;
        gatewayFeeAmount?: unknown;
        netAmount?: unknown;
        currency?: unknown;
        metadata?: unknown;
    });
    private toRequiredInteger;
    private toNullableInteger;
    private toNullableObject;
}
