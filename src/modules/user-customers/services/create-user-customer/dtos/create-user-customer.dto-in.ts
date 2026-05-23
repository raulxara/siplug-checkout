export class CreateUserCustomerDtoIn {
  public readonly clientId: string;
  public readonly profileId: string;
  public readonly token: string;
  public readonly twoFaRequired: boolean;
  public readonly twoFaActive: boolean;
  public readonly config: Record<string, unknown> | null;
  public readonly status: string;

  constructor(params: {
    clientId: string;
    profileId: string;
    token: string;
    twoFaRequired?: boolean;
    twoFaActive?: boolean;
    config?: Record<string, unknown> | null;
    status?: string;
  }) {
    this.clientId = params.clientId;
    this.profileId = params.profileId;
    this.token = params.token;
    this.twoFaRequired = params.twoFaRequired ?? false;
    this.twoFaActive = params.twoFaActive ?? false;
    this.config = params.config ?? null;
    this.status = params.status ?? 'active';

    if (this.clientId.trim() === '') {
      throw new Error('clientId is required');
    }

    if (this.profileId.trim() === '') {
      throw new Error('profileId is required');
    }

    if (this.token.trim() === '') {
      throw new Error('token is required');
    }
  }
}