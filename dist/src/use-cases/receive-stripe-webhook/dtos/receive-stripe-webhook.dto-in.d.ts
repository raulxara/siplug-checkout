export declare class ReceiveStripeWebhookDtoIn {
    readonly apiCredentialId: string;
    readonly rawBody: string;
    readonly payload: Record<string, unknown>;
    readonly headers: Record<string, unknown>;
    readonly stripeSignature: string;
    constructor(params: {
        apiCredentialId?: unknown;
        rawBody?: unknown;
        payload?: unknown;
        headers?: unknown;
        stripeSignature?: unknown;
    });
    private toObject;
}
