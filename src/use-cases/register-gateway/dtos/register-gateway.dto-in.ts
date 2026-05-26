export class RegisterGatewayDtoIn {
  public readonly token: string;
  public readonly name: string;
  public readonly slug: string;
  public readonly provider: string;
  public readonly description: string | null;
  public readonly config: Record<string, unknown> | null;
  public readonly status: string;

  constructor(params: {
    token?: string;
    name?: string;
    slug?: string;
    provider?: string;
    description?: string | null;
    config?: Record<string, unknown> | null;
    status?: string;
  }) {
    this.token = params.token ?? '';
    this.name = params.name ?? '';
    this.slug = params.slug ?? '';
    this.provider = params.provider ?? '';
    this.description = params.description ?? null;
    this.config = params.config ?? null;
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
  }
}