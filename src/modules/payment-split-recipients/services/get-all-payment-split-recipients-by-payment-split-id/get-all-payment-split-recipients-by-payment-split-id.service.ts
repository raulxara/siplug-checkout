import { Inject, Injectable } from '@nestjs/common';

import type { IPaymentSplitRecipientsRepository } from '../../entities/payment-split-recipients-repository.interface';
import { PAYMENT_SPLIT_RECIPIENTS_REPOSITORY } from '../../tokens/payment-split-recipients.tokens';
import { GetAllPaymentSplitRecipientsByPaymentSplitIdDtoIn } from './dtos/get-all-payment-split-recipients-by-payment-split-id.dto-in';
import { GetAllPaymentSplitRecipientsByPaymentSplitIdDtoOut } from './dtos/get-all-payment-split-recipients-by-payment-split-id.dto-out';

@Injectable()
export class GetAllPaymentSplitRecipientsByPaymentSplitIdService {
  constructor(
    @Inject(PAYMENT_SPLIT_RECIPIENTS_REPOSITORY)
    private readonly paymentSplitRecipientsRepository: IPaymentSplitRecipientsRepository,
  ) {}

  async exec(
    dtoIn: GetAllPaymentSplitRecipientsByPaymentSplitIdDtoIn,
  ): Promise<GetAllPaymentSplitRecipientsByPaymentSplitIdDtoOut> {
    const paymentSplitRecipients =
      await this.paymentSplitRecipientsRepository.getAllByPaymentSplitId(
        dtoIn.paymentSplitId,
      );

    return new GetAllPaymentSplitRecipientsByPaymentSplitIdDtoOut(
      paymentSplitRecipients as unknown as Array<Record<string, unknown>>,
    );
  }
}
