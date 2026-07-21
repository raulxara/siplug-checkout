export class UpdatePaymentCustomerDtoIn {
  public readonly _id: string;
  public readonly officeId: string | null;
  public readonly clientId: string | null;
  public readonly profileId: string | null;
  public readonly externalReference: string | null;
  public readonly name: string | null;
  public readonly email: string | null;
  public readonly documentType: string | null;
  public readonly documentValue: string | null;
  public readonly phone: string | null;
  public readonly billingAddress: Record<string, unknown> | null;
  public readonly metadata: Record<string, unknown> | null;
  public readonly config: Record<string, unknown> | null;
  public readonly status: string | null;
  public readonly source: string;

  constructor(params: {
    _id: string;
    officeId?: string | null;
    clientId?: string | null;
    profileId?: string | null;
    externalReference?: string | null;
    name?: string | null;
    email?: string | null;
    documentType?: string | null;
    documentValue?: string | null;
    phone?: string | null;
    billingAddress?: Record<string, unknown> | null;
    metadata?: Record<string, unknown> | null;
    config?: Record<string, unknown> | null;
    status?: string | null;
    source?: string;
  }) {
    this._id = params._id;
    this.officeId = params.officeId ?? null;
    this.clientId = params.clientId ?? null;
    this.profileId = params.profileId ?? null;
    this.externalReference = params.externalReference ?? null;
    this.name = params.name ?? null;
    this.email = params.email ?? null;
    this.documentType = params.documentType ?? null;
    this.documentValue = params.documentValue ?? null;
    this.phone = params.phone ?? null;
    this.billingAddress = params.billingAddress ?? null;
    this.metadata = params.metadata ?? null;
    this.config = params.config ?? null;
    this.status = params.status ?? null;
    this.source = params.source ?? 'UpdatePaymentCustomerService';

    if (this._id.trim() === '') {
      throw new Error('_id is required');
    }
  }
}