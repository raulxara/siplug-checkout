export declare class ReceiveMercadoPagoWebhookDtoIn {
    readonly apiCredentialId: string;
    readonly payload: Record<string, unknown>;
    readonly headers: Record<string, unknown>;
    readonly queryParams: Record<string, unknown>;
    readonly xSignature: string;
    readonly xRequestId: string;
    constructor(params: {
        apiCredentialId?: unknown;
        payload?: unknown;
        headers?: unknown;
        queryParams?: unknown;
        xSignature?: unknown;
        xRequestId?: unknown;
    });
    private toObject;
}
