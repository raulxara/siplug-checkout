import { Inject, Injectable } from '@nestjs/common';
import type { ICheckoutSessionsRepository } from '../../entities/checkout-sessions-repository.interface';
import { CHECKOUT_SESSIONS_REPOSITORY } from '../../tokens/checkout-sessions.tokens';
import { GetAllCheckoutSessionsByOfficeIdDtoIn } from './dtos/get-all-checkout-sessions-by-office-id.dto-in';
import { GetAllCheckoutSessionsByOfficeIdDtoOut } from './dtos/get-all-checkout-sessions-by-office-id.dto-out';

@Injectable()
export class GetAllCheckoutSessionsByOfficeIdService {
  constructor(
    @Inject(CHECKOUT_SESSIONS_REPOSITORY)
    private readonly repository: ICheckoutSessionsRepository,
  ) {}

  async exec(
    dtoIn: GetAllCheckoutSessionsByOfficeIdDtoIn,
  ): Promise<GetAllCheckoutSessionsByOfficeIdDtoOut> {
    try {
      const rows = await this.repository.getAllByOfficeId(dtoIn.officeId);

      return new GetAllCheckoutSessionsByOfficeIdDtoOut(rows, rows.length);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'error on get all checkout sessions by office id';

      throw new Error(message);
    }
  }
}