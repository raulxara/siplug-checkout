export class ReservePaymentSplitDispatchDtoIn {
  public readonly paymentSplitId: string;
  public readonly paymentTransactionId: string | null;
  public readonly provider: string;
  public readonly sourceTransactionId: string;
  public readonly webhookEventId: string | null;
  public readonly webhookEventType: string | null;
  public readonly source: string;

  constructor(params: {
    paymentSplitId?: unknown;
    paymentTransactionId?: unknown;
    provider?: unknown;
    sourceTransactionId?: unknown;
    webhookEventId?: unknown;
    webhookEventType?: unknown;
    source?: unknown;
  }) {
    this.paymentSplitId = String(params.paymentSplitId ?? '').trim();

    this.paymentTransactionId =
      params.paymentTransactionId !== undefined &&
      params.paymentTransactionId !== null
        ? String(params.paymentTransactionId).trim()
        : null;

    this.provider = String(params.provider ?? '').trim();

    this.sourceTransactionId = String(params.sourceTransactionId ?? '').trim();

    this.webhookEventId =
      params.webhookEventId !== undefined && params.webhookEventId !== null
        ? String(params.webhookEventId).trim()
        : null;

    this.webhookEventType =
      params.webhookEventType !== undefined &&
      params.webhookEventType !== null
        ? String(params.webhookEventType).trim()
        : null;

    this.source = String(
      params.source ?? 'ReservePaymentSplitDispatchService',
    ).trim();

    if (this.paymentSplitId === '') {
      throw new Error('paymentSplitId is required');
    }

    if (this.provider === '') {
      throw new Error('provider is required');
    }

    if (this.sourceTransactionId === '') {
      throw new Error('sourceTransactionId is required');
    }
  }
}
