export class UpdateGatewayDtoIn {
  public readonly token: string;
  public readonly gatewayId: string;

  public readonly name: string | null;
  public readonly slug: string | null;
  public readonly provider: string | null;
  public readonly description: string | null;
  public readonly config: Record<string, unknown> | null;
  public readonly status: string | null;
  public readonly source: string;

  constructor(params: {
    token?: string;
    gatewayId?: string;

    name?: string | null;
    slug?: string | null;
    provider?: string | null;
    description?: string | null;
    config?: Record<string, unknown> | null;
    status?: string | null;
    source?: string;
  }) {
    this.token = params.token ?? '';
    this.gatewayId = params.gatewayId ?? '';

    this.name = params.name ?? null;
    this.slug = params.slug ?? null;
    this.provider = params.provider ?? null;
    this.description = params.description ?? null;
    this.config = params.config ?? null;
    this.status = params.status ?? null;
    this.source = params.source ?? 'UpdateGatewayUseCase';

    if (this.token.trim() === '') {
      throw new Error('token is required');
    }

    if (this.gatewayId.trim() === '') {
      throw new Error('gatewayId is required');
    }
  }
}