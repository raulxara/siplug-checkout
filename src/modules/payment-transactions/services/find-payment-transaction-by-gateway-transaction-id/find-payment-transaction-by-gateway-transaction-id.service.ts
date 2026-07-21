import { Inject, Injectable } from '@nestjs/common';
import type { IPaymentTransactionsRepository } from '../../entities/payment-transactions-repository.interface';
import { PAYMENT_TRANSACTIONS_REPOSITORY } from '../../tokens/payment-transactions.tokens';
import { FindPaymentTransactionByGatewayTransactionIdDtoIn } from './dtos/find-payment-transaction-by-gateway-transaction-id.dto-in';
import { FindPaymentTransactionByGatewayTransactionIdDtoOut } from './dtos/find-payment-transaction-by-gateway-transaction-id.dto-out';

@Injectable()
export class FindPaymentTransactionByGatewayTransactionIdService {
  constructor(
    @Inject(PAYMENT_TRANSACTIONS_REPOSITORY)
    private readonly paymentTransactionsRepository: IPaymentTransactionsRepository,
  ) {}

  async exec(
    dtoIn: FindPaymentTransactionByGatewayTransactionIdDtoIn,
  ): Promise<FindPaymentTransactionByGatewayTransactionIdDtoOut> {
    try {
      const paymentTransaction =
        await this.paymentTransactionsRepository.findByGatewayTransactionId(
          dtoIn.gatewayTransactionId,
        );

      if (paymentTransaction === null) {
        throw new Error('payment transaction not found');
      }

      return new FindPaymentTransactionByGatewayTransactionIdDtoOut(
        paymentTransaction,
      );
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'error on find payment transaction by gateway transaction id';

      throw new Error(message);
    }
  }
}
