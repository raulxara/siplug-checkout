export declare class NormalizeMercadoPagoWebhookDtoIn {
    readonly payload: Record<string, unknown>;
    readonly payment: Record<string, unknown>;
    readonly headers: Record<string, unknown>;
    readonly queryParams: Record<string, unknown>;
    constructor(params: {
        payload?: unknown;
        payment?: unknown;
        headers?: unknown;
        queryParams?: unknown;
    });
    private toObject;
}
