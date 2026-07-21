export declare class ProcessRecurringPaymentRequest {
    checkoutSessionId: string;
    paymentMethod: string;
    gatewayProvider?: string;
    gatewaySlug?: string;
    gatewayId?: string;
    apiCredentialId?: string;
    payer?: Record<string, unknown>;
    paymentData?: Record<string, unknown>;
    metadata?: Record<string, unknown>;
    config?: Record<string, unknown>;
}
