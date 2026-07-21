import { Inject, Injectable } from '@nestjs/common';
import type { ICheckoutSessionsRepository } from '../../entities/checkout-sessions-repository.interface';
import { CHECKOUT_SESSIONS_REPOSITORY } from '../../tokens/checkout-sessions.tokens';
import { FindCheckoutSessionByUniqueIdDtoIn } from './dtos/find-checkout-session-by-unique-id.dto-in';
import { FindCheckoutSessionByUniqueIdDtoOut } from './dtos/find-checkout-session-by-unique-id.dto-out';

@Injectable()
export class FindCheckoutSessionByUniqueIdService {
  constructor(
    @Inject(CHECKOUT_SESSIONS_REPOSITORY)
    private readonly repository: ICheckoutSessionsRepository,
  ) {}

  async exec(
    dtoIn: FindCheckoutSessionByUniqueIdDtoIn,
  ): Promise<FindCheckoutSessionByUniqueIdDtoOut> {
    try {
      const checkoutSession = await this.repository.findByUniqueId(dtoIn._id);

      if (!checkoutSession) {
        throw new Error('checkout session not found');
      }

      return new FindCheckoutSessionByUniqueIdDtoOut(checkoutSession);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'error on find checkout session by unique id';

      throw new Error(message);
    }
  }
}