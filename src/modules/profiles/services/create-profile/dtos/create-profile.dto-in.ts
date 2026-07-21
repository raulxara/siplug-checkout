export class CreateProfileDtoIn {
  public readonly firstName: string;
  public readonly lastName: string;
  public readonly email: string;
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
  public readonly status: string;

  constructor(params: {
    firstName: string;
    lastName: string;
    email: string;
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
    status?: string;
  }) {
    this.firstName = params.firstName;
    this.lastName = params.lastName;
    this.email = params.email;
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
    this.status = params.status ?? 'active';

    if (this.firstName.trim() === '') {
      throw new Error('firstName is required');
    }

    if (this.lastName.trim() === '') {
      throw new Error('lastName is required');
    }

    if (this.email.trim() === '') {
      throw new Error('email is required');
    }
  }
}