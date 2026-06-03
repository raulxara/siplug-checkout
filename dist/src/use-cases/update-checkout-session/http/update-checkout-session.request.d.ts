export declare class UpdateCheckoutSessionItemRequest {
    checkoutSessionItemId: string;
    itemRef?: string | null;
    itemType?: string | null;
    name?: string | null;
    description?: string | null;
    quantity?: number | null;
    unitAmount?: number | null;
    totalAmount?: number | null;
    metadata?: Record<string, unknown> | null;
    config?: Record<string, unknown> | null;
    status?: string | null;
}
export declare class UpdateCheckoutSessionRequest {
    token?: string;
    checkoutSessionId: string;
    officeId?: string | null;
    clientId?: string | null;
    paymentCustomerId?: string | null;
    gatewayId?: string | null;
    apiCredentialId?: string | null;
    code?: string | null;
    externalReference?: string | null;
    idempotencyKey?: string | null;
    paymentType?: string | null;
    amount?: number | null;
    currency?: string | null;
    description?: string | null;
    successUrl?: string | null;
    cancelUrl?: string | null;
    expiresAt?: string | null;
    items?: UpdateCheckoutSessionItemRequest[];
    metadata?: Record<string, unknown> | null;
    config?: Record<string, unknown> | null;
    status?: string | null;
    source?: string;
}
