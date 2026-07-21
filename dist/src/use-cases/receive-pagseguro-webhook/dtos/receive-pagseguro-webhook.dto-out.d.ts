export declare class ReceivePagSeguroWebhookDtoOut {
    readonly paymentWebhookEvent: Record<string, unknown>;
    readonly paymentTransaction: Record<string, unknown> | null;
    readonly processingResult: Record<string, unknown>;
    readonly wasAlreadyRegistered: boolean;
    constructor(paymentWebhookEvent: Record<string, unknown>, paymentTransaction: Record<string, unknown> | null, processingResult: Record<string, unknown>, wasAlreadyRegistered: boolean);
}
