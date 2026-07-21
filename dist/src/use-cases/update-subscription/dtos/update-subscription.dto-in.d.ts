export declare class UpdateSubscriptionDtoIn {
    readonly token: string;
    readonly subscriptionId: string;
    readonly gatewaySubscriptionId: string | null;
    readonly currentCycle: number | null;
    readonly nextBillingAt: string | null;
    readonly startedAt: string | null;
    readonly canceledAt: string | null;
    readonly endedAt: string | null;
    readonly metadata: Record<string, unknown> | null;
    readonly config: Record<string, unknown> | null;
    readonly status: string | null;
    constructor(params: {
        token?: unknown;
        subscriptionId?: unknown;
        gatewaySubscriptionId?: unknown;
        currentCycle?: unknown;
        nextBillingAt?: unknown;
        startedAt?: unknown;
        canceledAt?: unknown;
        endedAt?: unknown;
        metadata?: unknown;
        config?: unknown;
        status?: unknown;
    });
    private toNullableString;
    private toNullableNumber;
    private toNullableObject;
}
