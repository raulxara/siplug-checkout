export class RegisterApiCredentialDtoIn {
  public readonly token: string;
  public readonly officeId: string | null;
  public readonly clientId: string | null;
  public readonly gatewayId: string | null;
  public readonly name: string;
  public readonly slug: string;
  public readonly provider: string;
  public readonly providerType: string;
  public readonly environment: string;
  public readonly providerToken: string;
  public readonly origin: string | null;
  public readonly config: Record<string, unknown> | null;
  public readonly expiresAt: string | null;
  public readonly status: string;

  constructor(params: {
    token?: string;
    officeId?: string | null;
    clientId?: string | null;
    gatewayId?: string | null;
    name?: string;
    slug?: string;
    provider?: string;
    providerType?: string;
    environment?: string;
    providerToken?: string;
    origin?: string | null;
    config?: Record<string, unknown> | null;
    expiresAt?: string | null;
    status?: string;
  }) {
    this.token = params.token ?? '';
    this.officeId = params.officeId ?? null;
    this.clientId = params.clientId ?? null;
    this.gatewayId = params.gatewayId ?? null;
    this.name = params.name ?? '';
    this.slug = params.slug ?? '';
    this.provider = params.provider ?? '';
    this.providerType = params.providerType ?? '';
    this.environment = params.environment ?? 'local';
    this.providerToken = params.providerToken ?? '';
    this.origin = params.origin ?? null;
    this.config = params.config ?? null;
    this.expiresAt = params.expiresAt ?? null;
    this.status = params.status ?? 'active';

    if (this.token.trim() === '') {
      throw new Error('token is required');
    }

    if (this.name.trim() === '') {
      throw new Error('name is required');
    }

    if (this.slug.trim() === '') {
      throw new Error('slug is required');
    }

    if (this.provider.trim() === '') {
      throw new Error('provider is required');
    }

    if (this.providerType.trim() === '') {
      throw new Error('providerType is required');
    }

    if (this.providerToken.trim() === '') {
      throw new Error('providerToken is required');
    }
  }
}