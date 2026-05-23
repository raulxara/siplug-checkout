export class CreateOfficeDtoIn {
  public readonly name: string;
  public readonly slug: string;
  public readonly language: string | null;
  public readonly currency: string | null;
  public readonly addressStreet: string | null;
  public readonly addressNumber: string | null;
  public readonly addressComplement: string | null;
  public readonly addressNeighborhood: string | null;
  public readonly addressCity: string | null;
  public readonly addressState: string | null;
  public readonly addressCountry: string | null;
  public readonly config: Record<string, unknown> | null;
  public readonly status: string;

  constructor(params: {
    name: string;
    slug: string;
    language?: string | null;
    currency?: string | null;
    addressStreet?: string | null;
    addressNumber?: string | null;
    addressComplement?: string | null;
    addressNeighborhood?: string | null;
    addressCity?: string | null;
    addressState?: string | null;
    addressCountry?: string | null;
    config?: Record<string, unknown> | null;
    status?: string;
  }) {
    this.name = params.name;
    this.slug = params.slug;
    this.language = params.language ?? null;
    this.currency = params.currency ?? 'BRL';
    this.addressStreet = params.addressStreet ?? null;
    this.addressNumber = params.addressNumber ?? null;
    this.addressComplement = params.addressComplement ?? null;
    this.addressNeighborhood = params.addressNeighborhood ?? null;
    this.addressCity = params.addressCity ?? null;
    this.addressState = params.addressState ?? null;
    this.addressCountry = params.addressCountry ?? null;
    this.config = params.config ?? null;
    this.status = params.status ?? 'active';

    if (this.name.trim() === '') {
      throw new Error('name is required');
    }

    if (this.slug.trim() === '') {
      throw new Error('slug is required');
    }
  }
}