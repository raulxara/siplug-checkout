export declare class ValidatePicPayWebhookDtoOut {
    readonly valid: boolean;
    readonly skipped: boolean;
    readonly reason: string | null;
    constructor(valid: boolean, skipped: boolean, reason: string | null);
}
