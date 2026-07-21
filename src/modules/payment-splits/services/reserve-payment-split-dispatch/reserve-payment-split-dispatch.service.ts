import { Inject, Injectable } from '@nestjs/common';

import type {
  IPaymentSplitsRepository,
  PaymentSplitRow,
} from '../../entities/payment-splits-repository.interface';
import { PAYMENT_SPLITS_REPOSITORY } from '../../tokens/payment-splits.tokens';
import { ReservePaymentSplitDispatchDtoIn } from './dtos/reserve-payment-split-dispatch.dto-in';
import { ReservePaymentSplitDispatchDtoOut } from './dtos/reserve-payment-split-dispatch.dto-out';

@Injectable()
export class ReservePaymentSplitDispatchService {
  constructor(
    @Inject(PAYMENT_SPLITS_REPOSITORY)
    private readonly paymentSplitsRepository: IPaymentSplitsRepository,
  ) {}

  async exec(
    dtoIn: ReservePaymentSplitDispatchDtoIn,
  ): Promise<ReservePaymentSplitDispatchDtoOut> {
    const paymentSplit = await this.paymentSplitsRepository.findByUniqueId(
      dtoIn.paymentSplitId,
    );

    if (paymentSplit === null) {
      return new ReservePaymentSplitDispatchDtoOut(
        false,
        'payment split not found',
        dtoIn.paymentSplitId,
        null,
        null,
        null,
        null,
      );
    }

    const previousStatus = String(paymentSplit.status ?? '').trim();

    if (!['created', 'failed'].includes(previousStatus)) {
      return new ReservePaymentSplitDispatchDtoOut(
        false,
        `payment split status ${previousStatus} is not available for dispatch reservation`,
        dtoIn.paymentSplitId,
        previousStatus,
        previousStatus,
        null,
        paymentSplit as unknown as Record<string, unknown>,
      );
    }

    const reservation = {
      provider: dtoIn.provider,
      sourceTransactionId: dtoIn.sourceTransactionId,
      paymentTransactionId: dtoIn.paymentTransactionId,
      webhookEventId: dtoIn.webhookEventId,
      webhookEventType: dtoIn.webhookEventType,
      reservedAt: new Date().toISOString(),
      source: dtoIn.source,
    };

    const updatedPaymentSplit =
      await this.paymentSplitsRepository.updateByUniqueId(
        dtoIn.paymentSplitId,
        {
          status: 'pending_gateway',

          providerPayload: {
            ...(this.toObject(paymentSplit.providerPayload) ?? {}),
            dispatchReservation: reservation,
          },

          metadata: {
            ...(this.toObject(paymentSplit.metadata) ?? {}),
            lastDispatchReservation: reservation,
          },

          source: dtoIn.source,
        },
      );

    return new ReservePaymentSplitDispatchDtoOut(
      true,
      'payment split dispatch reserved successfully',
      dtoIn.paymentSplitId,
      previousStatus,
      updatedPaymentSplit.status,
      reservation,
      updatedPaymentSplit as unknown as Record<string, unknown>,
    );
  }

  private toObject(value: unknown): Record<string, unknown> | null {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
      return null;
    }

    return value as Record<string, unknown>;
  }
}
