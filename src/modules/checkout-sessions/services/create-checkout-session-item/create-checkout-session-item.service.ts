import { Inject, Injectable } from '@nestjs/common';
import { CheckoutSessionItemEntity } from '../../entities/checkout-session-item.entity';
import type { ICheckoutSessionItemsRepository } from '../../entities/checkout-session-items-repository.interface';
import { CHECKOUT_SESSION_ITEMS_REPOSITORY } from '../../tokens/checkout-sessions.tokens';
import { CreateCheckoutSessionItemDtoIn } from './dtos/create-checkout-session-item.dto-in';
import { CreateCheckoutSessionItemDtoOut } from './dtos/create-checkout-session-item.dto-out';

@Injectable()
export class CreateCheckoutSessionItemService {
  constructor(
    @Inject(CHECKOUT_SESSION_ITEMS_REPOSITORY)
    private readonly repository: ICheckoutSessionItemsRepository,
  ) {}

  async exec(
    dtoIn: CreateCheckoutSessionItemDtoIn,
  ): Promise<CreateCheckoutSessionItemDtoOut> {
    try {
      const entity = new CheckoutSessionItemEntity(this.repository);

      entity.checkoutSessionId = dtoIn.checkoutSessionId;
      entity.itemRef = dtoIn.itemRef;
      entity.itemType = dtoIn.itemType;
      entity.name = dtoIn.name;
      entity.description = dtoIn.description;
      entity.quantity = dtoIn.quantity;
      entity.unitAmount = dtoIn.unitAmount;
      entity.totalAmount = dtoIn.totalAmount;
      entity.metadata = dtoIn.metadata;
      entity.config = dtoIn.config;
      entity.status = dtoIn.status;

      await entity.create();

      return CreateCheckoutSessionItemDtoOut.fromEntity(entity);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'error on create checkout session item';

      throw new Error(message);
    }
  }
}