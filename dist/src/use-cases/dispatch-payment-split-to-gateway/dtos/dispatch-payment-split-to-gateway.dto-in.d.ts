export declare class DispatchPaymentSplitToGatewayDtoIn {
    readonly paymentSplitId: string;
    readonly sourceTransactionId: string;
    readonly paymentTransactionId: string;
    readonly paymentWebhookEventId: string | null;
    readonly provider: string;
    readonly eventId: string | null;
    readonly eventType: string | null;
    readonly eventAction: string | null;
    readonly canonicalStatus: string | null;
    constructor(params: {
        paymentSplitId?: unknown;
        sourceTransactionId?: unknown;
        paymentTransactionId?: unknown;
        paymentWebhookEventId?: unknown;
        provider?: unknown;
        eventId?: unknown;
        eventType?: unknown;
        eventAction?: unknown;
        canonicalStatus?: unknown;
    });
    private toNullableString;
}
