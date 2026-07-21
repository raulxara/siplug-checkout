export class RegisterUserDtoIn {
  public readonly token: string;
  public readonly officeId: string;
  public readonly positionSlug: string;

  public readonly firstName: string;
  public readonly lastName: string;
  public readonly email: string;
  public readonly phone: string | null;

  public readonly documentType: string | null;
  public readonly documentValue: string | null;

  public readonly username: string;
  public readonly password: string;
  public readonly userType: string;

  public readonly twoFaRequired: boolean;
  public readonly twoFaChannels: string[];

  public readonly profileConfig: Record<string, unknown> | null;
  public readonly clientConfig: Record<string, unknown> | null;
  public readonly userCustomerConfig: Record<string, unknown> | null;

  public readonly status: string;

  constructor(params: {
    token?: string;
    officeId?: string;
    positionSlug?: string;

    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string | null;

    documentType?: string | null;
    documentValue?: string | null;

    username?: string;
    password?: string;
    userType?: string;

    twoFaRequired?: boolean;
    twoFaChannels?: string[];

    profileConfig?: Record<string, unknown> | null;
    clientConfig?: Record<string, unknown> | null;
    userCustomerConfig?: Record<string, unknown> | null;

    status?: string;
  }) {
    this.token = params.token ?? '';
    this.officeId = params.officeId ?? '';
    this.positionSlug = params.positionSlug ?? 'customer';

    this.firstName = params.firstName ?? '';
    this.lastName = params.lastName ?? '';
    this.email = params.email ?? '';
    this.phone = params.phone ?? null;

    this.documentType = params.documentType ?? null;
    this.documentValue = params.documentValue ?? null;

    this.username = params.username ?? '';
    this.password = params.password ?? '';
    this.userType = params.userType ?? 'customer';

    this.twoFaRequired = params.twoFaRequired ?? false;
    this.twoFaChannels = params.twoFaChannels ?? [];

    this.profileConfig = params.profileConfig ?? null;
    this.clientConfig = params.clientConfig ?? null;
    this.userCustomerConfig = params.userCustomerConfig ?? null;

    this.status = params.status ?? 'active';

    if (this.token.trim() === '') {
      throw new Error('token is required');
    }

    if (this.officeId.trim() === '') {
      throw new Error('officeId is required');
    }

    if (this.positionSlug.trim() === '') {
      throw new Error('positionSlug is required');
    }

    if (this.firstName.trim() === '') {
      throw new Error('firstName is required');
    }

    if (this.lastName.trim() === '') {
      throw new Error('lastName is required');
    }

    if (this.email.trim() === '') {
      throw new Error('email is required');
    }

    if (this.username.trim() === '') {
      throw new Error('username is required');
    }

    if (this.password.trim() === '') {
      throw new Error('password is required');
    }

    if (this.twoFaRequired && this.twoFaChannels.length === 0) {
      throw new Error('twoFaChannels is required when twoFaRequired is true');
    }

    for (const channel of this.twoFaChannels) {
      if (!['email', 'sms'].includes(channel)) {
        throw new Error('twoFaChannels contains invalid value');
      }
    }
  }
}