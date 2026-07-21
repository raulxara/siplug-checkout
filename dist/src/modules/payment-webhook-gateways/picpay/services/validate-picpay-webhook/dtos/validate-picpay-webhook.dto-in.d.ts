export type PicPayWebhookAuthMode = 'required' | 'optional';
export declare class ValidatePicPayWebhookDtoIn {
    readonly authorization: string | null;
    readonly webhookToken: string | null;
    readonly authMode: PicPayWebhookAuthMode;
    constructor(params: {
        authorization?: unknown;
        webhookToken?: unknown;
        authMode?: unknown;
    });
    private toNullableString;
}
