export declare class ReceivePagSeguroWebhookDtoIn {
    readonly apiCredentialId: string;
    readonly payload: Record<string, unknown>;
    readonly rawBody: string;
    readonly headers: Record<string, unknown>;
    readonly xAuthenticityToken: string | null;
    constructor(params: {
        apiCredentialId?: unknown;
        payload?: unknown;
        rawBody?: unknown;
        headers?: unknown;
        xAuthenticityToken?: unknown;
    });
    private toObject;
    private toNullableString;
}
