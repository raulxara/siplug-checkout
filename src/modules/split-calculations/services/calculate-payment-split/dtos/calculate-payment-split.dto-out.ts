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

export class CalculatePaymentSplitDtoOut {
  constructor(
    public readonly splitRule: Record<string, unknown>,
    public readonly calculationBase: string,
    public readonly grossAmount: number,
    public readonly gatewayFeeAmount: number,
    public readonly netAmount: number,
    public readonly baseAmount: number,
    public readonly allocatedAmount: number,
    public readonly unallocatedAmount: number,
    public readonly currency: string,
    public readonly recipients: CalculatedPaymentSplitRecipientDtoOut[],
    public readonly metadata: Record<string, unknown> | null,
  ) {}
}
