export class UpdateApiCredentialDtoIn {
  public readonly _id: string;

  public readonly officeId: string | null;
  public readonly clientId: string | null;
  public readonly gatewayId: string | null;
  public readonly name: string | null;
  public readonly slug: string | null;
  public readonly provider: string | null;
  public readonly providerType: string | null;
  public readonly environment: string | null;
  public readonly token: string | null;
  public readonly origin: string | null;
  public readonly config: Record<string, unknown> | null;
  public readonly expiresAt: string | null;
  public readonly status: string | null;
  public readonly source: string;

  constructor(params: {
    _id: string;
    officeId?: string | null;
    clientId?: string | null;
    gatewayId?: string | null;
    name?: string | null;
    slug?: string | null;
    provider?: string | null;
    providerType?: string | null;
    environment?: string | null;
    token?: string | null;
    origin?: string | null;
    config?: Record<string, unknown> | null;
    expiresAt?: string | null;
    status?: string | null;
    source?: string;
  }) {
    this._id = params._id;

    this.officeId = params.officeId ?? null;
    this.clientId = params.clientId ?? null;
    this.gatewayId = params.gatewayId ?? null;
    this.name = params.name ?? null;
    this.slug = params.slug ?? null;
    this.provider = params.provider ?? null;
    this.providerType = params.providerType ?? null;
    this.environment = params.environment ?? null;
    this.token = params.token ?? null;
    this.origin = params.origin ?? null;
    this.config = params.config ?? null;
    this.expiresAt = params.expiresAt ?? null;
    this.status = params.status ?? null;
    this.source = params.source ?? 'UpdateApiCredentialService';

    if (this._id.trim() === '') {
      throw new Error('_id is required');
    }
  }
}