import type { CheckoutSessionItemEntity } from '../../../entities/checkout-session-item.entity';

export class CreateCheckoutSessionItemDtoOut {
  constructor(
    public readonly id: number,
    public readonly _id: string,
    public readonly checkoutSessionId: string,
    public readonly itemRef: string | null,
    public readonly itemType: string | null,
    public readonly name: string,
    public readonly description: string | null,
    public readonly quantity: number,
    public readonly unitAmount: number,
    public readonly totalAmount: number,
    public readonly metadata: Record<string, unknown> | null,
    public readonly config: Record<string, unknown> | null,
    public readonly changesHistory: Array<Record<string, unknown>> | null,
    public readonly status: string,
    public readonly createdAt: string | null,
    public readonly updatedAt: string | null,
  ) {}

  static fromEntity(
    entity: CheckoutSessionItemEntity,
  ): CreateCheckoutSessionItemDtoOut {
    return new CreateCheckoutSessionItemDtoOut(
      entity.id ?? 0,
      entity._id ?? '',
      entity.checkoutSessionId,
      entity.itemRef,
      entity.itemType,
      entity.name,
      entity.description,
      entity.quantity,
      entity.unitAmount,
      entity.totalAmount,
      entity.metadata,
      entity.config,
      entity.changesHistory,
      entity.status ?? 'active',
      entity.createdAt,
      entity.updatedAt,
    );
  }
}