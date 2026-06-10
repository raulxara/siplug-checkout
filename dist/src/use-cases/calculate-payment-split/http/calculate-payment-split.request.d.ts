export declare class CalculatePaymentSplitRequest {
    token?: string;
    splitRuleId: string;
    grossAmount: number;
    gatewayFeeAmount?: number;
    netAmount?: number;
    currency?: string;
    metadata?: Record<string, unknown>;
}
