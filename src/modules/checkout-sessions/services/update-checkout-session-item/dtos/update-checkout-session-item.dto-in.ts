export class UpdateCheckoutSessionItemDtoIn {
  public readonly _id: string;

  public readonly checkoutSessionId: string | null;
  public readonly itemRef: string | null;
  public readonly itemType: string | null;
  public readonly name: string | null;
  public readonly description: string | null;

  public readonly quantity: number | null;
  public readonly unitAmount: number | null;
  public readonly totalAmount: number | null;

  public readonly metadata: Record<string, unknown> | null;
  public readonly config: Record<string, unknown> | null;

  public readonly status: string | null;
  public readonly source: string;

  constructor(params: {
    _id: string;
    checkoutSessionId?: string | null;
    itemRef?: string | null;
    itemType?: string | null;
    name?: string | null;
    description?: string | null;
    quantity?: number | null;
    unitAmount?: number | null;
    totalAmount?: number | null;
    metadata?: Record<string, unknown> | null;
    config?: Record<string, unknown> | null;
    status?: string | null;
    source?: string;
  }) {
    this._id = params._id;

    this.checkoutSessionId = params.checkoutSessionId ?? null;
    this.itemRef = params.itemRef ?? null;
    this.itemType = params.itemType ?? null;
    this.name = params.name ?? null;
    this.description = params.description ?? null;

    this.quantity = params.quantity ?? null;
    this.unitAmount = params.unitAmount ?? null;
    this.totalAmount = params.totalAmount ?? null;

    this.metadata = params.metadata ?? null;
    this.config = params.config ?? null;

    this.status = params.status ?? null;
    this.source = params.source ?? 'UpdateCheckoutSessionItemService';

    if (this._id.trim() === '') {
      throw new Error('_id is required');
    }
  }
}