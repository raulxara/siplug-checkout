export declare class NormalizePicPayWebhookDtoIn {
    readonly payload: Record<string, unknown>;
    readonly headers: Record<string, unknown>;
    readonly eventTypeHeader: string | null;
    constructor(params: {
        payload?: unknown;
        headers?: unknown;
        eventTypeHeader?: unknown;
    });
    private toObject;
    private toNullableString;
}
