export class UpdatePositionPermissionDtoIn {
  public readonly _id: string;
  public readonly positionId: string | null;
  public readonly permissionId: string | null;
  public readonly config: Record<string, unknown> | null;
  public readonly status: string | null;
  public readonly source: string;

  constructor(params: {
    _id: string;
    positionId?: string | null;
    permissionId?: string | null;
    config?: Record<string, unknown> | null;
    status?: string | null;
    source?: string;
  }) {
    this._id = params._id;
    this.positionId = params.positionId ?? null;
    this.permissionId = params.permissionId ?? null;
    this.config = params.config ?? null;
    this.status = params.status ?? null;
    this.source = params.source ?? 'system';

    if (this._id.trim() === '') {
      throw new Error('_id is required');
    }
  }
}