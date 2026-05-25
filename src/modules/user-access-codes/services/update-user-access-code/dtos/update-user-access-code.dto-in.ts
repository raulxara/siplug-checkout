export class UpdateUserAccessCodeDtoIn {
  public readonly _id: string;
  public readonly channel: string | null;
  public readonly destination: string | null;
  public readonly code: string | null;
  public readonly expiresAt: string | null;
  public readonly usedAt: string | null;
  public readonly sentAt: string | null;
  public readonly config: Record<string, unknown> | null;
  public readonly status: string | null;
  public readonly source: string;

  constructor(params: {
    _id: string;
    channel?: string | null;
    destination?: string | null;
    code?: string | null;
    expiresAt?: string | null;
    usedAt?: string | null;
    sentAt?: string | null;
    config?: Record<string, unknown> | null;
    status?: string | null;
    source?: string;
  }) {
    this._id = params._id;
    this.channel = params.channel ?? null;
    this.destination = params.destination ?? null;
    this.code = params.code ?? null;
    this.expiresAt = params.expiresAt ?? null;
    this.usedAt = params.usedAt ?? null;
    this.sentAt = params.sentAt ?? null;
    this.config = params.config ?? null;
    this.status = params.status ?? null;
    this.source = params.source ?? 'system';

    if (this._id.trim() === '') {
      throw new Error('_id is required');
    }
  }
}