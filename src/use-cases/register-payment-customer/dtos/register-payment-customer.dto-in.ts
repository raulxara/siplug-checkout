export class RegisterPaymentCustomerDtoIn {
  public readonly token: string;

  public readonly officeId: string;
  public readonly clientId: string;
  public readonly profileId: string | null;

  public readonly externalReference: string | null;
  public readonly name: string;
  public readonly email: string | null;
  public readonly documentType: string | null;
  public readonly documentValue: string | null;
  public readonly phone: string | null;

  public readonly billingAddress: Record<string, unknown> | null;
  public readonly metadata: Record<string, unknown> | null;
  public readonly config: Record<string, unknown> | null;

  public readonly status: string;

  constructor(params: {
    token?: string;

    officeId?: string;
    clientId?: string;
    profileId?: string | null;

    externalReference?: string | null;
    name?: string;
    email?: string | null;
    documentType?: string | null;
    documentValue?: string | null;
    phone?: string | null;

    billingAddress?: Record<string, unknown> | null;
    metadata?: Record<string, unknown> | null;
    config?: Record<string, unknown> | null;

    status?: string;
  }) {
    this.token = params.token ?? '';

    this.officeId = params.officeId ?? '';
    this.clientId = params.clientId ?? '';
    this.profileId = params.profileId ?? null;

    this.externalReference = params.externalReference ?? null;
    this.name = params.name ?? '';
    this.email = params.email ?? null;
    this.documentType = params.documentType ?? null;
    this.documentValue = params.documentValue ?? null;
    this.phone = params.phone ?? null;

    this.billingAddress = params.billingAddress ?? null;
    this.metadata = params.metadata ?? null;
    this.config = params.config ?? null;

    this.status = params.status ?? 'active';

    if (this.token.trim() === '') {
      throw new Error('token is required');
    }

    if (this.officeId.trim() === '') {
      throw new Error('officeId is required');
    }

    if (this.clientId.trim() === '') {
      throw new Error('clientId is required');
    }

    if (this.name.trim() === '') {
      throw new Error('name is required');
    }
  }
}