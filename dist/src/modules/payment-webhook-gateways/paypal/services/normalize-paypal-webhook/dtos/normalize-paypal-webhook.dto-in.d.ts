export declare class NormalizePayPalWebhookDtoIn {
    readonly payload: Record<string, unknown>;
    readonly headers: Record<string, unknown>;
    constructor(params: {
        payload?: unknown;
        headers?: unknown;
    });
    private toObject;
}
