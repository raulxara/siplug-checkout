export class CreateGatewayDtoIn {
  public readonly name: string;
  public readonly slug: string;
  public readonly provider: string;
  public readonly description: string | null;
  public readonly config: Record<string, unknown> | null;
  public readonly status: string;

  constructor(params: {
    name: string;
    slug: string;
    provider: string;
    description?: string | null;
    config?: Record<string, unknown> | null;
    status?: string;
  }) {
    this.name = params.name;
    this.slug = params.slug;
    this.provider = params.provider;
    this.description = params.description ?? null;
    this.config = params.config ?? null;
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
  }
}