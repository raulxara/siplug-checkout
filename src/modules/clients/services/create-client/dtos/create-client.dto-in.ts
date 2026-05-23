export class CreateClientDtoIn {
  public readonly officeId: string;
  public readonly customerId: string | null;
  public readonly userType: string;
  public readonly username: string;
  public readonly password: string;
  public readonly config: Record<string, unknown> | null;
  public readonly status: string;

  constructor(params: {
    officeId: string;
    customerId?: string | null;
    userType?: string;
    username: string;
    password: string;
    config?: Record<string, unknown> | null;
    status?: string;
  }) {
    this.officeId = params.officeId;
    this.customerId = params.customerId ?? null;
    this.userType = params.userType ?? 'client';
    this.username = params.username;
    this.password = params.password;
    this.config = params.config ?? null;
    this.status = params.status ?? 'active';

    if (this.officeId.trim() === '') {
      throw new Error('officeId is required');
    }

    if (this.userType.trim() === '') {
      throw new Error('userType is required');
    }

    if (this.username.trim() === '') {
      throw new Error('username is required');
    }

    if (this.password.trim() === '') {
      throw new Error('password is required');
    }
  }
}