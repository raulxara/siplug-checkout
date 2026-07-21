export declare class RegisterPaymentWebhookEventDtoOut {
    readonly paymentWebhookEvent: Record<string, unknown>;
    readonly wasAlreadyRegistered: boolean;
    constructor(paymentWebhookEvent: Record<string, unknown>, wasAlreadyRegistered: boolean);
}
