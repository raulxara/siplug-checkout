export declare class UpdateSubscriptionRequest {
    token?: string;
    subscriptionId?: string;
    _id?: string;
    gatewaySubscriptionId?: string;
    currentCycle?: number;
    nextBillingAt?: string;
    startedAt?: string;
    canceledAt?: string;
    endedAt?: string;
    metadata?: Record<string, unknown>;
    config?: Record<string, unknown>;
    status?: string;
}
