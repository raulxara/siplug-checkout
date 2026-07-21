import { Injectable } from '@nestjs/common';

import { GetAllPaymentSplitRecipientsByPaymentSplitIdDtoIn } from '../../modules/payment-split-recipients/services/get-all-payment-split-recipients-by-payment-split-id/dtos/get-all-payment-split-recipients-by-payment-split-id.dto-in';
import { GetAllPaymentSplitRecipientsByPaymentSplitIdService } from '../../modules/payment-split-recipients/services/get-all-payment-split-recipients-by-payment-split-id/get-all-payment-split-recipients-by-payment-split-id.service';
import { FindPaymentSplitByUniqueIdDtoIn } from '../../modules/payment-splits/services/find-payment-split-by-unique-id/dtos/find-payment-split-by-unique-id.dto-in';
import { FindPaymentSplitByUniqueIdService } from '../../modules/payment-splits/services/find-payment-split-by-unique-id/find-payment-split-by-unique-id.service';
import { ResolveActorAuthorizationService } from '../../modules/security/services/resolve-actor-authorization/resolve-actor-authorization.service';

import { GetPaymentSplitByUniqueIdDtoIn } from './dtos/get-payment-split-by-unique-id.dto-in';
import { GetPaymentSplitByUniqueIdDtoOut } from './dtos/get-payment-split-by-unique-id.dto-out';

@Injectable()
export class GetPaymentSplitByUniqueIdUseCase {
  constructor(
    private readonly findPaymentSplitByUniqueIdService: FindPaymentSplitByUniqueIdService,
    private readonly getAllPaymentSplitRecipientsByPaymentSplitIdService: GetAllPaymentSplitRecipientsByPaymentSplitIdService,
    private readonly resolveActorAuthorizationService: ResolveActorAuthorizationService,
  ) {}

  async exec(
    dtoIn: GetPaymentSplitByUniqueIdDtoIn,
  ): Promise<GetPaymentSplitByUniqueIdDtoOut> {
    await this.resolveActorAuthorizationService.exec({
      token: dtoIn.token,
      requiredEntity: 'paymentSplit',
      requiredAction: 'getPaymentSplitByUniqueId',
    });

    const paymentSplitDtoOut =
      await this.findPaymentSplitByUniqueIdService.exec(
        new FindPaymentSplitByUniqueIdDtoIn(dtoIn.paymentSplitId),
      );

    const paymentSplitRecipientsDtoOut =
      await this.getAllPaymentSplitRecipientsByPaymentSplitIdService.exec(
        new GetAllPaymentSplitRecipientsByPaymentSplitIdDtoIn(
          dtoIn.paymentSplitId,
        ),
      );

    return new GetPaymentSplitByUniqueIdDtoOut(
      paymentSplitDtoOut.paymentSplit,
      paymentSplitRecipientsDtoOut.paymentSplitRecipients,
    );
  }
}
