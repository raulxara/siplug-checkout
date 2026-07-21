export declare class CreateSubscriptionDtoIn {
    readonly officeId: string;
    readonly clientId: string;
    readonly subscriptionPlanId: string | null;
    readonly paymentCustomerId: string;
    readonly gatewayId: string | null;
    readonly apiCredentialId: string | null;
    readonly gatewaySubscriptionId: string | null;
    readonly externalReference: string | null;
    readonly amount: number;
    readonly currency: string;
    readonly currentCycle: number;
    readonly nextBillingAt: string | null;
    readonly startedAt: string | null;
    readonly canceledAt: string | null;
    readonly endedAt: string | null;
    readonly metadata: Record<string, unknown> | null;
    readonly config: Record<string, unknown> | null;
    readonly status: string;
    constructor(officeId: string, clientId: string, subscriptionPlanId: string | null, paymentCustomerId: string, gatewayId: string | null, apiCredentialId: string | null, gatewaySubscriptionId: string | null, externalReference: string | null, amount: number, currency: string, currentCycle: number, nextBillingAt: string | null, startedAt: string | null, canceledAt: string | null, endedAt: string | null, metadata: Record<string, unknown> | null, config: Record<string, unknown> | null, status: string);
}
