import { Inject, Injectable } from '@nestjs/common';
import type { IPaymentTransactionsRepository } from '../../entities/payment-transactions-repository.interface';
import { PAYMENT_TRANSACTIONS_REPOSITORY } from '../../tokens/payment-transactions.tokens';
import { GetAllPaymentTransactionsDtoIn } from './dtos/get-all-payment-transactions.dto-in';
import { GetAllPaymentTransactionsDtoOut } from './dtos/get-all-payment-transactions.dto-out';

@Injectable()
export class GetAllPaymentTransactionsService {
  constructor(
    @Inject(PAYMENT_TRANSACTIONS_REPOSITORY)
    private readonly repository: IPaymentTransactionsRepository,
  ) {}

  async exec(
    _dtoIn: GetAllPaymentTransactionsDtoIn,
  ): Promise<GetAllPaymentTransactionsDtoOut> {
    try {
      const rows = await this.repository.getAll();

      return new GetAllPaymentTransactionsDtoOut(rows);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'error on get all payment transactions';

      throw new Error(message);
    }
  }
}
