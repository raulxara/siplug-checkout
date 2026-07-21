import { Injectable } from '@nestjs/common';

import { GetAllPaymentSplitRecipientsByPaymentSplitIdDtoIn } from '../../modules/payment-split-recipients/services/get-all-payment-split-recipients-by-payment-split-id/dtos/get-all-payment-split-recipients-by-payment-split-id.dto-in';
import { GetAllPaymentSplitRecipientsByPaymentSplitIdService } from '../../modules/payment-split-recipients/services/get-all-payment-split-recipients-by-payment-split-id/get-all-payment-split-recipients-by-payment-split-id.service';
import { GetAllPaymentSplitsByOfficeIdDtoIn } from '../../modules/payment-splits/services/get-all-payment-splits-by-office-id/dtos/get-all-payment-splits-by-office-id.dto-in';
import { GetAllPaymentSplitsByOfficeIdService } from '../../modules/payment-splits/services/get-all-payment-splits-by-office-id/get-all-payment-splits-by-office-id.service';
import { ResolveActorAuthorizationService } from '../../modules/security/services/resolve-actor-authorization/resolve-actor-authorization.service';

import { ListPaymentSplitsByOfficeIdDtoIn } from './dtos/list-payment-splits-by-office-id.dto-in';
import { ListPaymentSplitsByOfficeIdDtoOut } from './dtos/list-payment-splits-by-office-id.dto-out';

@Injectable()
export class ListPaymentSplitsByOfficeIdUseCase {
  constructor(
    private readonly getAllPaymentSplitsByOfficeIdService: GetAllPaymentSplitsByOfficeIdService,
    private readonly getAllPaymentSplitRecipientsByPaymentSplitIdService: GetAllPaymentSplitRecipientsByPaymentSplitIdService,
    private readonly resolveActorAuthorizationService: ResolveActorAuthorizationService,
  ) {}

  async exec(
    dtoIn: ListPaymentSplitsByOfficeIdDtoIn,
  ): Promise<ListPaymentSplitsByOfficeIdDtoOut> {
    await this.resolveActorAuthorizationService.exec({
      token: dtoIn.token,
      requiredEntity: 'paymentSplit',
      requiredAction: 'listPaymentSplitsByOfficeId',
    });

    const paymentSplitsDtoOut =
      await this.getAllPaymentSplitsByOfficeIdService.exec(
        new GetAllPaymentSplitsByOfficeIdDtoIn(dtoIn.officeId),
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

    return new ListPaymentSplitsByOfficeIdDtoOut(paymentSplits);
  }
}
