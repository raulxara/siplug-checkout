import { Inject, Injectable } from '@nestjs/common';

import type { IPaymentSplitsRepository } from '../../entities/payment-splits-repository.interface';
import { PAYMENT_SPLITS_REPOSITORY } from '../../tokens/payment-splits.tokens';
import { GetAllPaymentSplitsByOfficeIdDtoIn } from './dtos/get-all-payment-splits-by-office-id.dto-in';
import { GetAllPaymentSplitsByOfficeIdDtoOut } from './dtos/get-all-payment-splits-by-office-id.dto-out';

@Injectable()
export class GetAllPaymentSplitsByOfficeIdService {
  constructor(
    @Inject(PAYMENT_SPLITS_REPOSITORY)
    private readonly paymentSplitsRepository: IPaymentSplitsRepository,
  ) {}

  async exec(
    dtoIn: GetAllPaymentSplitsByOfficeIdDtoIn,
  ): Promise<GetAllPaymentSplitsByOfficeIdDtoOut> {
    const paymentSplits = await this.paymentSplitsRepository.getAllByOfficeId(
      dtoIn.officeId,
    );

    return new GetAllPaymentSplitsByOfficeIdDtoOut(
      paymentSplits as unknown as Array<Record<string, unknown>>,
    );
  }
}
