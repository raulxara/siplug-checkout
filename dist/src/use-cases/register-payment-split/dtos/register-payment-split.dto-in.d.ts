export declare class RegisterPaymentSplitDtoIn {
    readonly token: string;
    readonly splitRuleId: string;
    readonly checkoutSessionId: string | null;
    readonly paymentTransactionId: string;
    readonly subscriptionId: string | null;
    readonly subscriptionInvoiceId: string | null;
    readonly gatewayProvider: string;
    readonly grossAmount: number;
    readonly gatewayFeeAmount: number | null;
    readonly netAmount: number | null;
    readonly currency: string;
    readonly metadata: Record<string, unknown> | null;
    readonly config: Record<string, unknown> | null;
    constructor(params: {
        token?: unknown;
        splitRuleId?: unknown;
        checkoutSessionId?: unknown;
        paymentTransactionId?: unknown;
        subscriptionId?: unknown;
        subscriptionInvoiceId?: unknown;
        gatewayProvider?: unknown;
        grossAmount?: unknown;
        gatewayFeeAmount?: unknown;
        netAmount?: unknown;
        currency?: unknown;
        metadata?: unknown;
        config?: unknown;
    });
    private toNullableString;
    private toRequiredInteger;
    private toNullableInteger;
    private toNullableObject;
}
