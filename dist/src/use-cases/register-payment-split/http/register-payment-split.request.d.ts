export declare class RegisterPaymentSplitRequest {
    token?: string;
    splitRuleId: string;
    checkoutSessionId?: string;
    paymentTransactionId: string;
    subscriptionId?: string;
    subscriptionInvoiceId?: string;
    gatewayProvider: string;
    grossAmount: number;
    gatewayFeeAmount?: number;
    netAmount?: number;
    currency?: string;
    metadata?: Record<string, unknown>;
    config?: Record<string, unknown>;
}
