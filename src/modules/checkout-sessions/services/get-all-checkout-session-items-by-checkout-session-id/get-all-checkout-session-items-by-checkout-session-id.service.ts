import { Inject, Injectable } from '@nestjs/common';
import type { ICheckoutSessionItemsRepository } from '../../entities/checkout-session-items-repository.interface';
import { CHECKOUT_SESSION_ITEMS_REPOSITORY } from '../../tokens/checkout-sessions.tokens';
import { GetAllCheckoutSessionItemsByCheckoutSessionIdDtoIn } from './dtos/get-all-checkout-session-items-by-checkout-session-id.dto-in';
import { GetAllCheckoutSessionItemsByCheckoutSessionIdDtoOut } from './dtos/get-all-checkout-session-items-by-checkout-session-id.dto-out';

@Injectable()
export class GetAllCheckoutSessionItemsByCheckoutSessionIdService {
  constructor(
    @Inject(CHECKOUT_SESSION_ITEMS_REPOSITORY)
    private readonly repository: ICheckoutSessionItemsRepository,
  ) {}

  async exec(
    dtoIn: GetAllCheckoutSessionItemsByCheckoutSessionIdDtoIn,
  ): Promise<GetAllCheckoutSessionItemsByCheckoutSessionIdDtoOut> {
    try {
      const rows = await this.repository.getAllByCheckoutSessionId(
        dtoIn.checkoutSessionId,
      );

      return new GetAllCheckoutSessionItemsByCheckoutSessionIdDtoOut(
        rows,
        rows.length,
      );
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'error on get all checkout session items by checkout session id';

      throw new Error(message);
    }
  }
}