export declare class RegisterSubscriptionDtoIn {
    readonly token: string;
    readonly officeId: string;
    readonly clientId: string;
    readonly subscriptionPlanId: string;
    readonly paymentCustomerId: string;
    readonly gatewayId: string | null;
    readonly apiCredentialId: string | null;
    readonly externalReference: string | null;
    readonly amount: number | null;
    readonly currency: string | null;
    readonly nextBillingAt: string | null;
    readonly metadata: Record<string, unknown> | null;
    readonly config: Record<string, unknown> | null;
    readonly status: string;
    constructor(params: {
        token: string;
        officeId: string;
        clientId: string;
        subscriptionPlanId: string;
        paymentCustomerId: string;
        gatewayId?: string | null;
        apiCredentialId?: string | null;
        externalReference?: string | null;
        amount?: number | null;
        currency?: string | null;
        nextBillingAt?: string | null;
        metadata?: Record<string, unknown> | null;
        config?: Record<string, unknown> | null;
        status?: string | null;
    });
    private normalizeNullableString;
}
