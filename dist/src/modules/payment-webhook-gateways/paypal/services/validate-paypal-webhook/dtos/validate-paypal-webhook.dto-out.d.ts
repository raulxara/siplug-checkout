export declare class ValidatePayPalWebhookDtoOut {
    readonly valid: boolean;
    readonly skipped: boolean;
    readonly reason: string | null;
    readonly providerResponse: Record<string, unknown> | null;
    constructor(valid: boolean, skipped: boolean, reason: string | null, providerResponse: Record<string, unknown> | null);
}
