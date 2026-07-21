export declare class MarkPaymentWebhookEventAsFailedDtoIn {
    readonly _id: string;
    readonly errorMessage: string;
    readonly processingResult: Record<string, unknown>;
    readonly source: string;
    constructor(params: {
        _id?: unknown;
        errorMessage?: unknown;
        processingResult?: unknown;
        source?: unknown;
    });
    private toObject;
}
