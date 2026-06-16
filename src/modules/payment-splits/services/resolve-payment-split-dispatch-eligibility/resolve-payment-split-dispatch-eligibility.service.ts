import { Inject, Injectable } from '@nestjs/common';

import type {
  IPaymentSplitsRepository,
  PaymentSplitRow,
} from '../../entities/payment-splits-repository.interface';
import { PAYMENT_SPLITS_REPOSITORY } from '../../tokens/payment-splits.tokens';
import { ResolvePaymentSplitDispatchEligibilityDtoIn } from './dtos/resolve-payment-split-dispatch-eligibility.dto-in';
import { ResolvePaymentSplitDispatchEligibilityDtoOut } from './dtos/resolve-payment-split-dispatch-eligibility.dto-out';

@Injectable()
export class ResolvePaymentSplitDispatchEligibilityService {
  constructor(
    @Inject(PAYMENT_SPLITS_REPOSITORY)
    private readonly paymentSplitsRepository: IPaymentSplitsRepository,
  ) {}

  async exec(
    dtoIn: ResolvePaymentSplitDispatchEligibilityDtoIn,
  ): Promise<ResolvePaymentSplitDispatchEligibilityDtoOut> {
    const paymentSplit = await this.paymentSplitsRepository.findByUniqueId(
      dtoIn.paymentSplitId,
    );

    if (paymentSplit === null) {
      return new ResolvePaymentSplitDispatchEligibilityDtoOut(
        false,
        'payment split not found',
        dtoIn.paymentSplitId,
        null,
        null,
      );
    }

    const status = this.extractStatus(paymentSplit);

    if (['created', 'failed'].includes(status)) {
      return new ResolvePaymentSplitDispatchEligibilityDtoOut(
        true,
        `payment split status ${status} is eligible for dispatch`,
        dtoIn.paymentSplitId,
        status,
        paymentSplit as unknown as Record<string, unknown>,
      );
    }

    if (status === 'pending_gateway') {
      return new ResolvePaymentSplitDispatchEligibilityDtoOut(
        false,
        'payment split already has pending gateway dispatch',
        dtoIn.paymentSplitId,
        status,
        paymentSplit as unknown as Record<string, unknown>,
      );
    }

    if (status === 'transferred') {
      return new ResolvePaymentSplitDispatchEligibilityDtoOut(
        false,
        'payment split already transferred',
        dtoIn.paymentSplitId,
        status,
        paymentSplit as unknown as Record<string, unknown>,
      );
    }

    if (status === 'refunded') {
      return new ResolvePaymentSplitDispatchEligibilityDtoOut(
        false,
        'payment split already refunded',
        dtoIn.paymentSplitId,
        status,
        paymentSplit as unknown as Record<string, unknown>,
      );
    }

    return new ResolvePaymentSplitDispatchEligibilityDtoOut(
      false,
      `payment split status ${status} is not eligible for dispatch`,
      dtoIn.paymentSplitId,
      status,
      paymentSplit as unknown as Record<string, unknown>,
    );
  }

  private extractStatus(paymentSplit: PaymentSplitRow): string {
    return String(paymentSplit.status ?? '').trim();
  }
}
