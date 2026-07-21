import { Inject, Injectable } from '@nestjs/common';
import type { IPaymentTransactionsRepository } from '../../entities/payment-transactions-repository.interface';
import { PAYMENT_TRANSACTIONS_REPOSITORY } from '../../tokens/payment-transactions.tokens';
import { GetAllPaymentTransactionsByCheckoutSessionIdDtoIn } from './dtos/get-all-payment-transactions-by-checkout-session-id.dto-in';
import { GetAllPaymentTransactionsByCheckoutSessionIdDtoOut } from './dtos/get-all-payment-transactions-by-checkout-session-id.dto-out';

@Injectable()
export class GetAllPaymentTransactionsByCheckoutSessionIdService {
  constructor(
    @Inject(PAYMENT_TRANSACTIONS_REPOSITORY)
    private readonly repository: IPaymentTransactionsRepository,
  ) {}

  async exec(
    dtoIn: GetAllPaymentTransactionsByCheckoutSessionIdDtoIn,
  ): Promise<GetAllPaymentTransactionsByCheckoutSessionIdDtoOut> {
    try {
      const rows = await this.repository.getAllByCheckoutSessionId(
        dtoIn.checkoutSessionId,
      );

      return new GetAllPaymentTransactionsByCheckoutSessionIdDtoOut(
        rows,
        rows.length,
      );
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'error on get all payment transactions by checkout session id';

      throw new Error(message);
    }
  }
}
