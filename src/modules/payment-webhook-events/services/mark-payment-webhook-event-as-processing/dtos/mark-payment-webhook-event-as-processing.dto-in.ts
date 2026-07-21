export class MarkPaymentWebhookEventAsProcessingDtoIn {
  public readonly _id: string;
  public readonly source: string;

  constructor(params: { _id?: unknown; source?: unknown }) {
    this._id = String(params._id ?? '').trim();
    this.source = String(
      params.source ?? 'MarkPaymentWebhookEventAsProcessingService',
    ).trim();

    if (this._id === '') {
      throw new Error('_id is required');
    }
  }
}
