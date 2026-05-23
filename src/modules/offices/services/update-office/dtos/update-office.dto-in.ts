export class UpdateOfficeDtoIn {
  public readonly _id: string;
  public readonly name: string | null;
  public readonly slug: string | null;
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
  public readonly status: string | null;
  public readonly source: string;

  constructor(params: {
    _id: string;
    name?: string | null;
    slug?: string | null;
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
    status?: string | null;
    source?: string;
  }) {
    this._id = params._id;
    this.name = params.name ?? null;
    this.slug = params.slug ?? null;
    this.language = params.language ?? null;
    this.currency = params.currency ?? null;
    this.addressStreet = params.addressStreet ?? null;
    this.addressNumber = params.addressNumber ?? null;
    this.addressComplement = params.addressComplement ?? null;
    this.addressNeighborhood = params.addressNeighborhood ?? null;
    this.addressCity = params.addressCity ?? null;
    this.addressState = params.addressState ?? null;
    this.addressCountry = params.addressCountry ?? null;
    this.config = params.config ?? null;
    this.status = params.status ?? null;
    this.source = params.source ?? 'system';

    if (this._id.trim() === '') {
      throw new Error('_id is required');
    }
  }
}