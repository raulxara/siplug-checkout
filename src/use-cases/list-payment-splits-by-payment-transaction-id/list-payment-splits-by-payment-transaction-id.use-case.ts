import { Injectable } from '@nestjs/common';

import { GetAllPaymentSplitRecipientsByPaymentSplitIdDtoIn } from '../../modules/payment-split-recipients/services/get-all-payment-split-recipients-by-payment-split-id/dtos/get-all-payment-split-recipients-by-payment-split-id.dto-in';
import { GetAllPaymentSplitRecipientsByPaymentSplitIdService } from '../../modules/payment-split-recipients/services/get-all-payment-split-recipients-by-payment-split-id/get-all-payment-split-recipients-by-payment-split-id.service';
import { GetAllPaymentSplitsByPaymentTransactionIdDtoIn } from '../../modules/payment-splits/services/get-all-payment-splits-by-payment-transaction-id/dtos/get-all-payment-splits-by-payment-transaction-id.dto-in';
import { GetAllPaymentSplitsByPaymentTransactionIdService } from '../../modules/payment-splits/services/get-all-payment-splits-by-payment-transaction-id/get-all-payment-splits-by-payment-transaction-id.service';
import { ResolveActorAuthorizationService } from '../../modules/security/services/resolve-actor-authorization/resolve-actor-authorization.service';

import { ListPaymentSplitsByPaymentTransactionIdDtoIn } from './dtos/list-payment-splits-by-payment-transaction-id.dto-in';
import { ListPaymentSplitsByPaymentTransactionIdDtoOut } from './dtos/list-payment-splits-by-payment-transaction-id.dto-out';

@Injectable()
export class ListPaymentSplitsByPaymentTransactionIdUseCase {
  constructor(
    private readonly getAllPaymentSplitsByPaymentTransactionIdService: GetAllPaymentSplitsByPaymentTransactionIdService,
    private readonly getAllPaymentSplitRecipientsByPaymentSplitIdService: GetAllPaymentSplitRecipientsByPaymentSplitIdService,
    private readonly resolveActorAuthorizationService: ResolveActorAuthorizationService,
  ) {}

  async exec(
    dtoIn: ListPaymentSplitsByPaymentTransactionIdDtoIn,
  ): Promise<ListPaymentSplitsByPaymentTransactionIdDtoOut> {
    await this.resolveActorAuthorizationService.exec({
      token: dtoIn.token,
      requiredEntity: 'paymentSplit',
      requiredAction: 'listPaymentSplitsByPaymentTransactionId',
    });

    const paymentSplitsDtoOut =
      await this.getAllPaymentSplitsByPaymentTransactionIdService.exec(
        new GetAllPaymentSplitsByPaymentTransactionIdDtoIn(
          dtoIn.paymentTransactionId,
        ),
      );

    const paymentSplits: Array<{
      paymentSplit: Record<string, unknown>;
      paymentSplitRecipients: Array<Record<string, unknown>>;
    }> = [];

    for (const paymentSplit of paymentSplitsDtoOut.paymentSplits) {
      const paymentSplitRecipientsDtoOut =
        await this.getAllPaymentSplitRecipientsByPaymentSplitIdService.exec(
          new GetAllPaymentSplitRecipientsByPaymentSplitIdDtoIn(
            String(paymentSplit._id),
          ),
        );

      paymentSplits.push({
        paymentSplit,
        paymentSplitRecipients:
          paymentSplitRecipientsDtoOut.paymentSplitRecipients,
      });
    }

    return new ListPaymentSplitsByPaymentTransactionIdDtoOut(paymentSplits);
  }
}
