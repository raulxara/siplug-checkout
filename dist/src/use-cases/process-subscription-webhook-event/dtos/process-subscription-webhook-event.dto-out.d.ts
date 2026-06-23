export declare class ProcessSubscriptionWebhookEventDtoOut {
    readonly paymentWebhookEvent: Record<string, unknown>;
    readonly paymentTransaction: Record<string, unknown> | null;
    readonly subscription: Record<string, unknown> | null;
    readonly subscriptionCycle: Record<string, unknown> | null;
    readonly subscriptionInvoice: Record<string, unknown> | null;
    readonly subscriptionUpdated: boolean;
    readonly subscriptionCycleUpdated: boolean;
    readonly subscriptionInvoiceUpdated: boolean;
    readonly processingResult: Record<string, unknown>;
    constructor(paymentWebhookEvent: Record<string, unknown>, paymentTransaction: Record<string, unknown> | null, subscription: Record<string, unknown> | null, subscriptionCycle: Record<string, unknown> | null, subscriptionInvoice: Record<string, unknown> | null, subscriptionUpdated: boolean, subscriptionCycleUpdated: boolean, subscriptionInvoiceUpdated: boolean, processingResult: Record<string, unknown>);
}
