export class UpdateUserPositionDtoIn {
  public readonly _id: string;
  public readonly userCustomerId: string | null;
  public readonly positionId: string | null;
  public readonly config: Record<string, unknown> | null;
  public readonly status: string | null;
  public readonly source: string;

  constructor(params: {
    _id: string;
    userCustomerId?: string | null;
    positionId?: string | null;
    config?: Record<string, unknown> | null;
    status?: string | null;
    source?: string;
  }) {
    this._id = params._id;
    this.userCustomerId = params.userCustomerId ?? null;
    this.positionId = params.positionId ?? null;
    this.config = params.config ?? null;
    this.status = params.status ?? null;
    this.source = params.source ?? 'system';

    if (this._id.trim() === '') {
      throw new Error('_id is required');
    }
  }
}