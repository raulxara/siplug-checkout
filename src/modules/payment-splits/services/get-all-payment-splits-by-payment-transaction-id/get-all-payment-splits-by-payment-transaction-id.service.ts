import { Inject, Injectable } from '@nestjs/common';

import type { IPaymentSplitsRepository } from '../../entities/payment-splits-repository.interface';
import { PAYMENT_SPLITS_REPOSITORY } from '../../tokens/payment-splits.tokens';
import { GetAllPaymentSplitsByPaymentTransactionIdDtoIn } from './dtos/get-all-payment-splits-by-payment-transaction-id.dto-in';
import { GetAllPaymentSplitsByPaymentTransactionIdDtoOut } from './dtos/get-all-payment-splits-by-payment-transaction-id.dto-out';

@Injectable()
export class GetAllPaymentSplitsByPaymentTransactionIdService {
  constructor(
    @Inject(PAYMENT_SPLITS_REPOSITORY)
    private readonly paymentSplitsRepository: IPaymentSplitsRepository,
  ) {}

  async exec(
    dtoIn: GetAllPaymentSplitsByPaymentTransactionIdDtoIn,
  ): Promise<GetAllPaymentSplitsByPaymentTransactionIdDtoOut> {
    const paymentSplits =
      await this.paymentSplitsRepository.getAllByPaymentTransactionId(
        dtoIn.paymentTransactionId,
      );

    return new GetAllPaymentSplitsByPaymentTransactionIdDtoOut(
      paymentSplits as unknown as Array<Record<string, unknown>>,
    );
  }
}
