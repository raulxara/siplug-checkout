export declare class MarkPaymentWebhookEventAsProcessedDtoIn {
    readonly _id: string;
    readonly processingResult: Record<string, unknown>;
    readonly source: string;
    constructor(params: {
        _id?: unknown;
        processingResult?: unknown;
        source?: unknown;
    });
    private toObject;
}
