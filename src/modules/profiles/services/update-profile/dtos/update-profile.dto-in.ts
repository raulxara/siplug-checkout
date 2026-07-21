export class UpdateProfileDtoIn {
  public readonly _id: string;
  public readonly firstName: string | null;
  public readonly lastName: string | null;
  public readonly email: string | null;
  public readonly phone: string | null;
  public readonly documentType: string | null;
  public readonly documentValue: string | null;
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
    firstName?: string | null;
    lastName?: string | null;
    email?: string | null;
    phone?: string | null;
    documentType?: string | null;
    documentValue?: string | null;
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
    this.firstName = params.firstName ?? null;
    this.lastName = params.lastName ?? null;
    this.email = params.email ?? null;
    this.phone = params.phone ?? null;
    this.documentType = params.documentType ?? null;
    this.documentValue = params.documentValue ?? null;
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