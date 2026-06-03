export declare class RegisterSubscriptionRequest {
    officeId: string;
    clientId: string;
    subscriptionPlanId: string;
    paymentCustomerId: string;
    gatewayId?: string;
    apiCredentialId?: string;
    externalReference?: string;
    amount?: number;
    currency?: string;
    nextBillingAt?: string;
    metadata?: Record<string, unknown>;
    config?: Record<string, unknown>;
    status?: string;
}
