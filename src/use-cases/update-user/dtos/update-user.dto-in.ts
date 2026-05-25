export class UpdateUserDtoIn {
  public readonly token: string;
  public readonly userCustomerId: string;

  public readonly officeId: string | null;
  public readonly positionSlug: string | null;

  public readonly firstName: string | null;
  public readonly lastName: string | null;
  public readonly email: string | null;
  public readonly phone: string | null;

  public readonly documentType: string | null;
  public readonly documentValue: string | null;

  public readonly username: string | null;
  public readonly password: string | null;
  public readonly userType: string | null;

  public readonly twoFaRequired: boolean | null;
  public readonly twoFaActive: boolean | null;

  public readonly profileConfig: Record<string, unknown> | null;
  public readonly clientConfig: Record<string, unknown> | null;
  public readonly userCustomerConfig: Record<string, unknown> | null;

  public readonly status: string | null;
  public readonly source: string;

  constructor(params: {
    token?: string;
    userCustomerId?: string;

    officeId?: string | null;
    positionSlug?: string | null;

    firstName?: string | null;
    lastName?: string | null;
    email?: string | null;
    phone?: string | null;

    documentType?: string | null;
    documentValue?: string | null;

    username?: string | null;
    password?: string | null;
    userType?: string | null;

    twoFaRequired?: boolean | null;
    twoFaActive?: boolean | null;

    profileConfig?: Record<string, unknown> | null;
    clientConfig?: Record<string, unknown> | null;
    userCustomerConfig?: Record<string, unknown> | null;

    status?: string | null;
    source?: string;
  }) {
    this.token = params.token ?? '';
    this.userCustomerId = params.userCustomerId ?? '';

    this.officeId = params.officeId ?? null;
    this.positionSlug = params.positionSlug ?? null;

    this.firstName = params.firstName ?? null;
    this.lastName = params.lastName ?? null;
    this.email = params.email ?? null;
    this.phone = params.phone ?? null;

    this.documentType = params.documentType ?? null;
    this.documentValue = params.documentValue ?? null;

    this.username = params.username ?? null;
    this.password = params.password ?? null;
    this.userType = params.userType ?? null;

    this.twoFaRequired = params.twoFaRequired ?? null;
    this.twoFaActive = params.twoFaActive ?? null;

    this.profileConfig = params.profileConfig ?? null;
    this.clientConfig = params.clientConfig ?? null;
    this.userCustomerConfig = params.userCustomerConfig ?? null;

    this.status = params.status ?? null;
    this.source = params.source ?? 'UpdateUserUseCase';

    if (this.token.trim() === '') {
      throw new Error('token is required');
    }

    if (this.userCustomerId.trim() === '') {
      throw new Error('userCustomerId is required');
    }
  }
}