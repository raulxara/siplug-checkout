export declare class ProcessRecurringPaymentDtoIn {
    readonly token: string;
    readonly checkoutSessionId: string;
    readonly paymentMethod: string;
    readonly gatewayProvider: string | null;
    readonly gatewaySlug: string | null;
    readonly gatewayId: string | null;
    readonly apiCredentialId: string | null;
    readonly payer: Record<string, unknown> | null;
    readonly paymentData: Record<string, unknown> | null;
    readonly metadata: Record<string, unknown> | null;
    readonly config: Record<string, unknown> | null;
    constructor(params: {
        token: string;
        checkoutSessionId: string;
        paymentMethod: string;
        gatewayProvider?: string | null;
        gatewaySlug?: string | null;
        gatewayId?: string | null;
        apiCredentialId?: string | null;
        payer?: Record<string, unknown> | null;
        paymentData?: Record<string, unknown> | null;
        metadata?: Record<string, unknown> | null;
        config?: Record<string, unknown> | null;
    });
    private normalizeNullableString;
}
