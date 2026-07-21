export class ValidatePositionSlugUniquenessDtoIn {
  public readonly officeId: string | null;
  public readonly slug: string;

  constructor(params: { officeId?: string | null; slug: string }) {
    this.officeId = params.officeId ?? null;
    this.slug = params.slug;

    if (this.slug.trim() === '') {
      throw new Error('slug is required');
    }
  }
}