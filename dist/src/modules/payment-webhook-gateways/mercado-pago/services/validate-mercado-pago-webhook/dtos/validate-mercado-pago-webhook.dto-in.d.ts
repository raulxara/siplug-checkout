export declare class ValidateMercadoPagoWebhookDtoIn {
    readonly xSignature: string;
    readonly xRequestId: string;
    readonly dataId: string | null;
    readonly webhookSecret: string;
    constructor(params: {
        xSignature?: unknown;
        xRequestId?: unknown;
        dataId?: unknown;
        webhookSecret?: unknown;
    });
    private toNullableString;
}
