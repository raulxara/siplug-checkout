export class FindSubscriptionPlanBySlugAndOfficeIdDtoIn {
  public readonly slug: string;
  public readonly officeId: string;

  constructor(params: {
    slug: string;
    officeId: string;
  }) {
    if (!params.slug || params.slug.trim() === '') {
      throw new Error('slug is required');
    }

    if (!params.officeId || params.officeId.trim() === '') {
      throw new Error('officeId is required');
    }

    this.slug = params.slug.trim();
    this.officeId = params.officeId.trim();
  }
}