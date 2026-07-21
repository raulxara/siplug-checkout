import { Inject, Injectable } from '@nestjs/common';
import type { IPaymentTransactionsRepository } from '../../entities/payment-transactions-repository.interface';
import { PAYMENT_TRANSACTIONS_REPOSITORY } from '../../tokens/payment-transactions.tokens';
import { GetAllPaymentTransactionsByOfficeIdDtoIn } from './dtos/get-all-payment-transactions-by-office-id.dto-in';
import { GetAllPaymentTransactionsByOfficeIdDtoOut } from './dtos/get-all-payment-transactions-by-office-id.dto-out';

@Injectable()
export class GetAllPaymentTransactionsByOfficeIdService {
  constructor(
    @Inject(PAYMENT_TRANSACTIONS_REPOSITORY)
    private readonly repository: IPaymentTransactionsRepository,
  ) {}

  async exec(
    dtoIn: GetAllPaymentTransactionsByOfficeIdDtoIn,
  ): Promise<GetAllPaymentTransactionsByOfficeIdDtoOut> {
    try {
      const rows = await this.repository.getAllByOfficeId(dtoIn.officeId);

      return new GetAllPaymentTransactionsByOfficeIdDtoOut(rows, rows.length);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'error on get all payment transactions by office id';

      throw new Error(message);
    }
  }
}
