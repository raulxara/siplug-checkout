export declare class CapturePayPalOrderReturnDtoOut {
    readonly paymentWebhookEvent: Record<string, unknown>;
    readonly paymentTransaction: Record<string, unknown> | null;
    readonly processingResult: Record<string, unknown>;
    readonly providerResponse: Record<string, unknown> | null;
    readonly wasAlreadyRegistered: boolean;
    constructor(paymentWebhookEvent: Record<string, unknown>, paymentTransaction: Record<string, unknown> | null, processingResult: Record<string, unknown>, providerResponse: Record<string, unknown> | null, wasAlreadyRegistered: boolean);
}
