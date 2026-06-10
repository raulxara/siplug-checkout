export type CalculatedPaymentSplitRecipientDtoOut = {
    splitRuleRecipientId: string;
    splitRecipientId: string;
    role: string;
    percentage: number | null;
    fixedAmount: number | null;
    amount: number;
    currency: string;
    liableForGatewayFee: boolean;
    liableForRefund: boolean;
    priority: number;
    metadata: Record<string, unknown> | null;
    config: Record<string, unknown> | null;
};
export declare class CalculatePaymentSplitDtoOut {
    readonly splitRule: Record<string, unknown>;
    readonly calculationBase: string;
    readonly grossAmount: number;
    readonly gatewayFeeAmount: number;
    readonly netAmount: number;
    readonly baseAmount: number;
    readonly allocatedAmount: number;
    readonly unallocatedAmount: number;
    readonly currency: string;
    readonly recipients: CalculatedPaymentSplitRecipientDtoOut[];
    readonly metadata: Record<string, unknown> | null;
    constructor(splitRule: Record<string, unknown>, calculationBase: string, grossAmount: number, gatewayFeeAmount: number, netAmount: number, baseAmount: number, allocatedAmount: number, unallocatedAmount: number, currency: string, recipients: CalculatedPaymentSplitRecipientDtoOut[], metadata: Record<string, unknown> | null);
}
