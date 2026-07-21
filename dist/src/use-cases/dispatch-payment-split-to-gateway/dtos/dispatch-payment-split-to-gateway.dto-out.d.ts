export declare class DispatchPaymentSplitToGatewayDtoOut {
    readonly dispatched: boolean;
    readonly reason: string;
    readonly paymentSplit: Record<string, unknown> | null;
    readonly paymentSplitRecipients: Array<Record<string, unknown>>;
    readonly gatewayResult: Record<string, unknown> | null;
    constructor(dispatched: boolean, reason: string, paymentSplit: Record<string, unknown> | null, paymentSplitRecipients: Array<Record<string, unknown>>, gatewayResult: Record<string, unknown> | null);
}
