import { AbstractEntity } from '../../../shared/entities/abstract.entity';
import type { ICheckoutSessionItemsRepository } from './checkout-session-items-repository.interface';

export class CheckoutSessionItemEntity extends AbstractEntity {
  public checkoutSessionId!: string;

  public itemRef: string | null = null;
  public itemType: string | null = null;
  public name!: string;
  public description: string | null = null;

  public quantity!: number;
  public unitAmount!: number;
  public totalAmount!: number;

  public metadata: Record<string, unknown> | null = null;
  public config: Record<string, unknown> | null = null;
  public changesHistory: Array<Record<string, unknown>> | null = null;

  constructor(private readonly repository: ICheckoutSessionItemsRepository) {
    super();
  }

  async create(): Promise<CheckoutSessionItemEntity> {
    const fresh = await this.repository.create(this);

    this.hydrate({
      id: fresh.id,
      _id: fresh._id,
      checkoutSessionId: fresh.checkoutSessionId,
      itemRef: fresh.itemRef,
      itemType: fresh.itemType,
      name: fresh.name,
      description: fresh.description,
      quantity: fresh.quantity,
      unitAmount: fresh.unitAmount,
      totalAmount: fresh.totalAmount,
      metadata: fresh.metadata,
      config: fresh.config,
      changesHistory: fresh.changesHistory,
      status: fresh.status,
      createdAt: fresh.createdAt,
      updatedAt: fresh.updatedAt,
    });

    return this;
  }
}
