export class RegisterPositionDtoIn {
  public readonly token: string;
  public readonly officeId: string | null;
  public readonly name: string;
  public readonly slug: string;
  public readonly description: string | null;
  public readonly config: Record<string, unknown> | null;
  public readonly status: string;

  constructor(params: {
    token?: string;
    officeId?: string | null;
    name?: string;
    slug?: string;
    description?: string | null;
    config?: Record<string, unknown> | null;
    status?: string;
  }) {
    this.token = params.token ?? '';
    this.officeId = params.officeId ?? null;
    this.name = params.name ?? '';
    this.slug = params.slug ?? '';
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
  }
}