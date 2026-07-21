export class NormalizeApiCredentialConfigDtoIn {
  public readonly slug: string;
  public readonly config: Record<string, unknown> | null;

  constructor(params: {
    slug: string;
    config?: Record<string, unknown> | null;
  }) {
    this.slug = params.slug;
    this.config = params.config ?? null;

    if (this.slug.trim() === '') {
      throw new Error('slug is required');
    }
  }
}