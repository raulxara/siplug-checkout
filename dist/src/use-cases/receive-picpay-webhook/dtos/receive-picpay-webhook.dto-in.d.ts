export declare class ReceivePicPayWebhookDtoIn {
    readonly apiCredentialId: string;
    readonly payload: Record<string, unknown>;
    readonly rawBody: string;
    readonly headers: Record<string, unknown>;
    readonly authorization: string | null;
    readonly eventTypeHeader: string | null;
    constructor(params: {
        apiCredentialId?: unknown;
        payload?: unknown;
        rawBody?: unknown;
        headers?: unknown;
        authorization?: unknown;
        eventTypeHeader?: unknown;
    });
    private toObject;
    private toNullableString;
}
