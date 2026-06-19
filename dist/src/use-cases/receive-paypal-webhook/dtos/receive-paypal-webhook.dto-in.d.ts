export declare class ReceivePayPalWebhookDtoIn {
    readonly apiCredentialId: string;
    readonly payload: Record<string, unknown>;
    readonly headers: Record<string, unknown>;
    constructor(params: {
        apiCredentialId?: unknown;
        payload?: unknown;
        headers?: unknown;
    });
    private toObject;
}
