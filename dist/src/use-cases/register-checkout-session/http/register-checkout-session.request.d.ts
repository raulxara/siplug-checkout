export declare class RegisterCheckoutSessionItemRequest {
    itemRef?: string | null;
    itemType?: string | null;
    name: string;
    description?: string | null;
    quantity?: number;
    unitAmount: number;
    totalAmount?: number;
    metadata?: Record<string, unknown> | null;
    config?: Record<string, unknown> | null;
    status?: string;
}
export declare class RegisterCheckoutSessionRequest {
    token?: string;
    officeId: string;
    clientId: string;
    paymentCustomerId?: string | null;
    gatewayId: string;
    apiCredentialId?: string | null;
    code?: string | null;
    externalReference?: string | null;
    idempotencyKey?: string | null;
    paymentType: string;
    amount: number;
    currency?: string;
    description?: string | null;
    successUrl?: string | null;
    cancelUrl?: string | null;
    expiresAt?: string | null;
    items: RegisterCheckoutSessionItemRequest[];
    metadata?: Record<string, unknown> | null;
    config?: Record<string, unknown> | null;
    status?: string;
}
