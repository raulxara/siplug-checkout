export class FindOfficeBySlugDtoIn {
  public readonly slug: string;

  constructor(slug: string) {
    this.slug = slug;

    if (this.slug.trim() === '') {
      throw new Error('slug is required');
    }
  }
}