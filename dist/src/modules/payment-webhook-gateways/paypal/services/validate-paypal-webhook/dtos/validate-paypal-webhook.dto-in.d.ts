export declare class ValidatePayPalWebhookDtoIn {
    readonly baseUrl: string;
    readonly accessToken: string;
    readonly webhookId: string | null;
    readonly authMode: string;
    readonly payload: Record<string, unknown>;
    readonly headers: Record<string, unknown>;
    constructor(params: {
        baseUrl?: unknown;
        accessToken?: unknown;
        webhookId?: unknown;
        authMode?: unknown;
        payload?: unknown;
        headers?: unknown;
    });
    private toObject;
    private toNullableString;
}
