export declare class ValidateStripeWebhookDtoIn {
    readonly rawBody: string;
    readonly stripeSignature: string;
    readonly endpointSecret: string;
    readonly toleranceInSeconds: number;
    constructor(params: {
        rawBody?: unknown;
        stripeSignature?: unknown;
        endpointSecret?: unknown;
        toleranceInSeconds?: unknown;
    });
}
