export class UpdateClientDtoIn {
  public readonly _id: string;
  public readonly officeId: string | null;
  public readonly customerId: string | null;
  public readonly userType: string | null;
  public readonly username: string | null;
  public readonly password: string | null;
  public readonly config: Record<string, unknown> | null;
  public readonly status: string | null;
  public readonly source: string;

  constructor(params: {
    _id: string;
    officeId?: string | null;
    customerId?: string | null;
    userType?: string | null;
    username?: string | null;
    password?: string | null;
    config?: Record<string, unknown> | null;
    status?: string | null;
    source?: string;
  }) {
    this._id = params._id;
    this.officeId = params.officeId ?? null;
    this.customerId = params.customerId ?? null;
    this.userType = params.userType ?? null;
    this.username = params.username ?? null;
    this.password = params.password ?? null;
    this.config = params.config ?? null;
    this.status = params.status ?? null;
    this.source = params.source ?? 'system';

    if (this._id.trim() === '') {
      throw new Error('_id is required');
    }
  }
}