export declare class ReservePaymentSplitDispatchDtoOut {
    readonly reserved: boolean;
    readonly reason: string;
    readonly paymentSplitId: string;
    readonly previousStatus: string | null;
    readonly currentStatus: string | null;
    readonly reservation: Record<string, unknown> | null;
    readonly paymentSplit: Record<string, unknown> | null;
    constructor(reserved: boolean, reason: string, paymentSplitId: string, previousStatus: string | null, currentStatus: string | null, reservation: Record<string, unknown> | null, paymentSplit: Record<string, unknown> | null);
}
