export declare class ProcessPaymentWebhookEventDtoOut {
    readonly paymentWebhookEvent: Record<string, unknown>;
    readonly paymentTransaction: Record<string, unknown> | null;
    readonly transactionUpdated: boolean;
    readonly splitDispatchRequired: boolean;
    readonly processingResult: Record<string, unknown>;
    constructor(paymentWebhookEvent: Record<string, unknown>, paymentTransaction: Record<string, unknown> | null, transactionUpdated: boolean, splitDispatchRequired: boolean, processingResult: Record<string, unknown>);
}
