import { Inject, Injectable } from '@nestjs/common';

import type { IPaymentSplitsRepository } from '../../entities/payment-splits-repository.interface';
import { PAYMENT_SPLITS_REPOSITORY } from '../../tokens/payment-splits.tokens';
import { FindPaymentSplitByUniqueIdDtoIn } from './dtos/find-payment-split-by-unique-id.dto-in';
import { FindPaymentSplitByUniqueIdDtoOut } from './dtos/find-payment-split-by-unique-id.dto-out';

@Injectable()
export class FindPaymentSplitByUniqueIdService {
  constructor(
    @Inject(PAYMENT_SPLITS_REPOSITORY)
    private readonly paymentSplitsRepository: IPaymentSplitsRepository,
  ) {}

  async exec(
    dtoIn: FindPaymentSplitByUniqueIdDtoIn,
  ): Promise<FindPaymentSplitByUniqueIdDtoOut> {
    const paymentSplit = await this.paymentSplitsRepository.findByUniqueId(
      dtoIn.paymentSplitId,
    );

    if (paymentSplit === null) {
      throw new Error('payment split not found');
    }

    return new FindPaymentSplitByUniqueIdDtoOut(paymentSplit);
  }
}
