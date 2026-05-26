import type { CheckoutSessionItemEntity } from './checkout-session-item.entity';

export type CheckoutSessionItemRow = {
  id: number;
  _id: string;

  checkoutSessionId: string;

  itemRef: string | null;
  itemType: string | null;
  name: string;
  description: string | null;

  quantity: number;
  unitAmount: number;
  totalAmount: number;

  metadata: Record<string, unknown> | null;
  config: Record<string, unknown> | null;
  changesHistory: Array<Record<string, unknown>> | null;

  status: string;

  createdAt: string | null;
  updatedAt: string | null;
};

export interface ICheckoutSessionItemsRepository {
  create(entity: CheckoutSessionItemEntity): Promise<CheckoutSessionItemEntity>;

  updateByUniqueId(
    _id: string,
    data: Record<string, unknown>,
  ): Promise<CheckoutSessionItemRow>;

  findByUniqueId(_id: string): Promise<CheckoutSessionItemRow | null>;

  getAllByCheckoutSessionId(
    checkoutSessionId: string,
  ): Promise<CheckoutSessionItemRow[]>;
}
