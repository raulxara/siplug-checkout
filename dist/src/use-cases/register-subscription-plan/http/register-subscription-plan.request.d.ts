export declare class RegisterSubscriptionPlanRequest {
    officeId: string;
    clientId: string;
    gatewayId?: string;
    apiCredentialId?: string;
    name: string;
    slug: string;
    description?: string;
    billingInterval: string;
    billingIntervalCount?: number;
    amount: number;
    currency?: string;
    trialDays?: number;
    maxBillingCycles?: number;
    paymentMethods?: string[];
    metadata?: Record<string, unknown>;
    config?: Record<string, unknown>;
    status?: string;
}
