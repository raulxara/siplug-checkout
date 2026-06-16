export type GatewaySplitTransferRecipientDto = {
    paymentSplitRecipientId: string;
    splitRecipientId: string;
    destinationAccountId: string;
    amount: number;
    currency: string;
    role: string;
    metadata: Record<string, unknown> | null;
    config: Record<string, unknown> | null;
};
export declare class GatewaySplitTransferDtoIn {
    readonly gatewayProvider: string;
    readonly providerToken: string;
    readonly paymentSplitId: string;
    readonly paymentTransactionId: string;
    readonly paymentWebhookEventId: string | null;
    readonly sourceTransactionId: string;
    readonly idempotencyKey: string;
    readonly recipients: GatewaySplitTransferRecipientDto[];
    readonly metadata: Record<string, unknown> | null;
    readonly config: Record<string, unknown> | null;
    constructor(params: {
        gatewayProvider?: unknown;
        providerToken?: unknown;
        paymentSplitId?: unknown;
        paymentTransactionId?: unknown;
        paymentWebhookEventId?: unknown;
        sourceTransactionId?: unknown;
        idempotencyKey?: unknown;
        recipients?: GatewaySplitTransferRecipientDto[];
        metadata?: unknown;
        config?: unknown;
    });
    private toNullableString;
    private toNullableObject;
}
