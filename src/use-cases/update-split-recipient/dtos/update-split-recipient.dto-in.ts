export class UpdateSplitRecipientDtoIn {
  public readonly token: string;
  public readonly splitRecipientId: string;

  public readonly officeId: string | null;
  public readonly clientId: string | null;
  public readonly gatewayId: string | null;
  public readonly apiCredentialId: string | null;

  public readonly name: string | null;
  public readonly documentType: string | null;
  public readonly documentValue: string | null;
  public readonly email: string | null;

  public readonly gatewayProvider: string | null;
  public readonly gatewayRecipientId: string | null;
  public readonly gatewayAccountId: string | null;

  public readonly bankData: Record<string, unknown> | null;
  public readonly metadata: Record<string, unknown> | null;
  public readonly config: Record<string, unknown> | null;

  public readonly status: string | null;

  constructor(params: {
    token?: unknown;
    splitRecipientId?: unknown;

    officeId?: unknown;
    clientId?: unknown;
    gatewayId?: unknown;
    apiCredentialId?: unknown;

    name?: unknown;
    documentType?: unknown;
    documentValue?: unknown;
    email?: unknown;

    gatewayProvider?: unknown;
    gatewayRecipientId?: unknown;
    gatewayAccountId?: unknown;

    bankData?: unknown;
    metadata?: unknown;
    config?: unknown;

    status?: unknown;
  }) {
    this.token = String(params.token ?? '').trim();
    this.splitRecipientId = String(params.splitRecipientId ?? '').trim();

    if (this.token === '') {
      throw new Error('token is required');
    }

    if (this.splitRecipientId === '') {
      throw new Error('splitRecipientId is required');
    }

    this.officeId = this.toNullableString(params.officeId);
    this.clientId = this.toNullableString(params.clientId);
    this.gatewayId = this.toNullableString(params.gatewayId);
    this.apiCredentialId = this.toNullableString(params.apiCredentialId);

    this.name = this.toNullableString(params.name);
    this.documentType = this.toNullableString(params.documentType);
    this.documentValue = this.toNullableString(params.documentValue);
    this.email = this.toNullableString(params.email);

    this.gatewayProvider = this.toNullableString(params.gatewayProvider);
    this.gatewayRecipientId = this.toNullableString(params.gatewayRecipientId);
    this.gatewayAccountId = this.toNullableString(params.gatewayAccountId);

    this.bankData = this.toNullableObject(params.bankData);
    this.metadata = this.toNullableObject(params.metadata);
    this.config = this.toNullableObject(params.config);

    this.status = this.toNullableString(params.status);
  }

  private toNullableString(value: unknown): string | null {
    if (value === undefined || value === null) {
      return null;
    }

    const stringValue = String(value).trim();

    return stringValue === '' ? null : stringValue;
  }

  private toNullableObject(value: unknown): Record<string, unknown> | null {
    if (value === undefined || value === null) {
      return null;
    }

    if (typeof value !== 'object' || Array.isArray(value)) {
      throw new Error('value must be an object');
    }

    return value as Record<string, unknown>;
  }
}
