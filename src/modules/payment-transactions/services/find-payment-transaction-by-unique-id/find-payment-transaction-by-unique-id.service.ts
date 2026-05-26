import { Inject, Injectable } from '@nestjs/common';
import type { IPaymentTransactionsRepository } from '../../entities/payment-transactions-repository.interface';
import { PAYMENT_TRANSACTIONS_REPOSITORY } from '../../tokens/payment-transactions.tokens';
import { FindPaymentTransactionByUniqueIdDtoIn } from './dtos/find-payment-transaction-by-unique-id.dto-in';
import { FindPaymentTransactionByUniqueIdDtoOut } from './dtos/find-payment-transaction-by-unique-id.dto-out';

@Injectable()
export class FindPaymentTransactionByUniqueIdService {
  constructor(
    @Inject(PAYMENT_TRANSACTIONS_REPOSITORY)
    private readonly repository: IPaymentTransactionsRepository,
  ) {}

  async exec(
    dtoIn: FindPaymentTransactionByUniqueIdDtoIn,
  ): Promise<FindPaymentTransactionByUniqueIdDtoOut> {
    try {
      const paymentTransaction = await this.repository.findByUniqueId(
        dtoIn._id,
      );

      if (!paymentTransaction) {
        throw new Error('payment transaction not found');
      }

      return new FindPaymentTransactionByUniqueIdDtoOut(paymentTransaction);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'error on find payment transaction by unique id';

      throw new Error(message);
    }
  }
}
