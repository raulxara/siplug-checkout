export declare class GetPaymentSplitByUniqueIdDtoOut {
    readonly paymentSplit: Record<string, unknown>;
    readonly paymentSplitRecipients: Array<Record<string, unknown>>;
    constructor(paymentSplit: Record<string, unknown>, paymentSplitRecipients: Array<Record<string, unknown>>);
}
