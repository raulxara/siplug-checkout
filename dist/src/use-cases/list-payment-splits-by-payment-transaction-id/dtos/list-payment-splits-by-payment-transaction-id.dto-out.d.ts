export declare class ListPaymentSplitsByPaymentTransactionIdDtoOut {
    readonly paymentSplits: Array<{
        paymentSplit: Record<string, unknown>;
        paymentSplitRecipients: Array<Record<string, unknown>>;
    }>;
    constructor(paymentSplits: Array<{
        paymentSplit: Record<string, unknown>;
        paymentSplitRecipients: Array<Record<string, unknown>>;
    }>);
}
