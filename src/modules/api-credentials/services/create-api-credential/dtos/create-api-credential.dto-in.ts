export class CreateApiCredentialDtoIn {
  public readonly officeId: string | null;
  public readonly clientId: string | null;
  public readonly gatewayId: string | null;
  public readonly name: string;
  public readonly slug: string;
  public readonly provider: string;
  public readonly providerType: string;
  public readonly environment: string;
  public readonly token: string;
  public readonly origin: string | null;
  public readonly config: Record<string, unknown> | null;
  public readonly expiresAt: string | null;
  public readonly status: string;

  constructor(params: {
    officeId?: string | null;
    clientId?: string | null;
    gatewayId?: string | null;
    name: string;
    slug: string;
    provider: string;
    providerType: string;
    environment?: string;
    token: string;
    origin?: string | null;
    config?: Record<string, unknown> | null;
    expiresAt?: string | null;
    status?: string;
  }) {
    this.officeId = params.officeId ?? null;
    this.clientId = params.clientId ?? null;
    this.gatewayId = params.gatewayId ?? null;
    this.name = params.name;
    this.slug = params.slug;
    this.provider = params.provider;
    this.providerType = params.providerType;
    this.environment = params.environment ?? 'local';
    this.token = params.token;
    this.origin = params.origin ?? null;
    this.config = params.config ?? null;
    this.expiresAt = params.expiresAt ?? null;
    this.status = params.status ?? 'active';

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

    if (this.token.trim() === '') {
      throw new Error('token is required');
    }
  }
}