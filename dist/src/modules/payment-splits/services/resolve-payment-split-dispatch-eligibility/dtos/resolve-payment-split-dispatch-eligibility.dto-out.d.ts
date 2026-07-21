export declare class ResolvePaymentSplitDispatchEligibilityDtoOut {
    readonly eligible: boolean;
    readonly reason: string;
    readonly paymentSplitId: string;
    readonly currentStatus: string | null;
    readonly paymentSplit: Record<string, unknown> | null;
    constructor(eligible: boolean, reason: string, paymentSplitId: string, currentStatus: string | null, paymentSplit: Record<string, unknown> | null);
}
