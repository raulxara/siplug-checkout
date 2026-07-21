export class UpdateUserCustomerDtoIn {
  public readonly _id: string;
  public readonly clientId: string | null;
  public readonly profileId: string | null;
  public readonly token: string | null;
  public readonly twoFaRequired: boolean | null;
  public readonly twoFaActive: boolean | null;
  public readonly config: Record<string, unknown> | null;
  public readonly status: string | null;
  public readonly source: string;

  constructor(params: {
    _id: string;
    clientId?: string | null;
    profileId?: string | null;
    token?: string | null;
    twoFaRequired?: boolean | null;
    twoFaActive?: boolean | null;
    config?: Record<string, unknown> | null;
    status?: string | null;
    source?: string;
  }) {
    this._id = params._id;
    this.clientId = params.clientId ?? null;
    this.profileId = params.profileId ?? null;
    this.token = params.token ?? null;
    this.twoFaRequired = params.twoFaRequired ?? null;
    this.twoFaActive = params.twoFaActive ?? null;
    this.config = params.config ?? null;
    this.status = params.status ?? null;
    this.source = params.source ?? 'system';

    if (this._id.trim() === '') {
      throw new Error('_id is required');
    }
  }
}