export declare class ReceiveInfinitePayWebhookDtoIn {
    readonly apiCredentialId: string | null;
    readonly payload: Record<string, unknown>;
    readonly headers: Record<string, unknown>;
    constructor(params: {
        apiCredentialId?: unknown;
        payload?: Record<string, unknown>;
        headers?: Record<string, unknown>;
    });
}
