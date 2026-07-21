export class ResolvePaymentSplitDispatchEligibilityDtoIn {
  public readonly paymentSplitId: string;
  public readonly source: string;

  constructor(params: { paymentSplitId?: unknown; source?: unknown }) {
    this.paymentSplitId = String(params.paymentSplitId ?? '').trim();
    this.source = String(
      params.source ?? 'ResolvePaymentSplitDispatchEligibilityService',
    ).trim();

    if (this.paymentSplitId === '') {
      throw new Error('paymentSplitId is required');
    }
  }
}