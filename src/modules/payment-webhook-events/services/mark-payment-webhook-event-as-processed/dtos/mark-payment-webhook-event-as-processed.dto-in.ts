export class MarkPaymentWebhookEventAsProcessedDtoIn {
  public readonly _id: string;
  public readonly processingResult: Record<string, unknown>;
  public readonly source: string;

  constructor(params: {
    _id?: unknown;
    processingResult?: unknown;
    source?: unknown;
  }) {
    this._id = String(params._id ?? '').trim();
    this.processingResult = this.toObject(params.processingResult);
    this.source = String(params.source ?? 'system').trim();

    if (this._id === '') {
      throw new Error('_id is required');
    }
  }

  private toObject(value: unknown): Record<string, unknown> {
    if (value === undefined || value === null) {
      return {};
    }

    if (typeof value !== 'object' || Array.isArray(value)) {
      throw new Error('processingResult must be an object');
    }

    return value as Record<string, unknown>;
  }
}
