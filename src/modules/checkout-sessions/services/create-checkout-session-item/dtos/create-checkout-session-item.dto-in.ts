export class CreateCheckoutSessionItemDtoIn {
  public readonly checkoutSessionId: string;

  public readonly itemRef: string | null;
  public readonly itemType: string | null;
  public readonly name: string;
  public readonly description: string | null;

  public readonly quantity: number;
  public readonly unitAmount: number;
  public readonly totalAmount: number;

  public readonly metadata: Record<string, unknown> | null;
  public readonly config: Record<string, unknown> | null;

  public readonly status: string;

  constructor(params: {
    checkoutSessionId: string;
    itemRef?: string | null;
    itemType?: string | null;
    name: string;
    description?: string | null;
    quantity?: number;
    unitAmount: number;
    totalAmount?: number;
    metadata?: Record<string, unknown> | null;
    config?: Record<string, unknown> | null;
    status?: string;
  }) {
    this.checkoutSessionId = params.checkoutSessionId;

    this.itemRef = params.itemRef ?? null;
    this.itemType = params.itemType ?? null;
    this.name = params.name;
    this.description = params.description ?? null;

    this.quantity = params.quantity ?? 1;
    this.unitAmount = Number(params.unitAmount);
    this.totalAmount =
      params.totalAmount ?? this.quantity * Number(params.unitAmount);

    this.metadata = params.metadata ?? null;
    this.config = params.config ?? null;

    this.status = params.status ?? 'active';

    if (this.checkoutSessionId.trim() === '') {
      throw new Error('checkoutSessionId is required');
    }

    if (this.name.trim() === '') {
      throw new Error('name is required');
    }

    if (!Number.isFinite(this.quantity) || this.quantity <= 0) {
      throw new Error('quantity must be greater than zero');
    }

    if (!Number.isFinite(this.unitAmount) || this.unitAmount <= 0) {
      throw new Error('unitAmount must be greater than zero');
    }

    if (!Number.isFinite(this.totalAmount) || this.totalAmount <= 0) {
      throw new Error('totalAmount must be greater than zero');
    }
  }
}