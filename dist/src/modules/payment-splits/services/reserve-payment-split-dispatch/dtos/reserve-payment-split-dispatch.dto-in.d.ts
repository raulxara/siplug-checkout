export declare class ReservePaymentSplitDispatchDtoIn {
    readonly paymentSplitId: string;
    readonly paymentTransactionId: string | null;
    readonly provider: string;
    readonly sourceTransactionId: string;
    readonly webhookEventId: string | null;
    readonly webhookEventType: string | null;
    readonly source: string;
    constructor(params: {
        paymentSplitId?: unknown;
        paymentTransactionId?: unknown;
        provider?: unknown;
        sourceTransactionId?: unknown;
        webhookEventId?: unknown;
        webhookEventType?: unknown;
        source?: unknown;
    });
}
