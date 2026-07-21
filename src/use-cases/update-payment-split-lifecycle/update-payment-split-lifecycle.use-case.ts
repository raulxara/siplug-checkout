import { Injectable } from '@nestjs/common';

import { GetAllPaymentSplitRecipientsByPaymentSplitIdDtoIn } from '../../modules/payment-split-recipients/services/get-all-payment-split-recipients-by-payment-split-id/dtos/get-all-payment-split-recipients-by-payment-split-id.dto-in';
import { GetAllPaymentSplitRecipientsByPaymentSplitIdService } from '../../modules/payment-split-recipients/services/get-all-payment-split-recipients-by-payment-split-id/get-all-payment-split-recipients-by-payment-split-id.service';
import { UpdatePaymentSplitRecipientStatusDtoIn } from '../../modules/payment-split-recipients/services/update-payment-split-recipient-status/dtos/update-payment-split-recipient-status.dto-in';
import { UpdatePaymentSplitRecipientStatusService } from '../../modules/payment-split-recipients/services/update-payment-split-recipient-status/update-payment-split-recipient-status.service';
import { FindPaymentSplitByUniqueIdDtoIn } from '../../modules/payment-splits/services/find-payment-split-by-unique-id/dtos/find-payment-split-by-unique-id.dto-in';
import { FindPaymentSplitByUniqueIdService } from '../../modules/payment-splits/services/find-payment-split-by-unique-id/find-payment-split-by-unique-id.service';
import { UpdatePaymentSplitStatusDtoIn } from '../../modules/payment-splits/services/update-payment-split-status/dtos/update-payment-split-status.dto-in';
import { UpdatePaymentSplitStatusService } from '../../modules/payment-splits/services/update-payment-split-status/update-payment-split-status.service';
import { ResolveActorAuthorizationService } from '../../modules/security/services/resolve-actor-authorization/resolve-actor-authorization.service';

import {
  UpdatePaymentSplitLifecycleDtoIn,
  UpdatePaymentSplitLifecycleRecipientDtoIn,
} from './dtos/update-payment-split-lifecycle.dto-in';
import { UpdatePaymentSplitLifecycleDtoOut } from './dtos/update-payment-split-lifecycle.dto-out';

@Injectable()
export class UpdatePaymentSplitLifecycleUseCase {
  constructor(
    private readonly resolveActorAuthorizationService: ResolveActorAuthorizationService,
    private readonly findPaymentSplitByUniqueIdService: FindPaymentSplitByUniqueIdService,
    private readonly updatePaymentSplitStatusService: UpdatePaymentSplitStatusService,
    private readonly getAllPaymentSplitRecipientsByPaymentSplitIdService: GetAllPaymentSplitRecipientsByPaymentSplitIdService,
    private readonly updatePaymentSplitRecipientStatusService: UpdatePaymentSplitRecipientStatusService,
  ) {}

  async exec(
    dtoIn: UpdatePaymentSplitLifecycleDtoIn,
  ): Promise<UpdatePaymentSplitLifecycleDtoOut> {
    await this.resolveActorAuthorizationService.exec({
      token: dtoIn.token,
      requiredEntity: 'paymentSplit',
      requiredAction: 'updatePaymentSplitLifecycle',
    });

    await this.findPaymentSplitByUniqueIdService.exec(
      new FindPaymentSplitByUniqueIdDtoIn(dtoIn.paymentSplitId),
    );

    const currentRecipientsDtoOut =
      await this.getAllPaymentSplitRecipientsByPaymentSplitIdService.exec(
        new GetAllPaymentSplitRecipientsByPaymentSplitIdDtoIn(
          dtoIn.paymentSplitId,
        ),
      );

    const paymentSplitDtoOut = await this.updatePaymentSplitStatusService.exec(
      new UpdatePaymentSplitStatusDtoIn(
        dtoIn.paymentSplitId,
        dtoIn.status,

        dtoIn.gatewaySplitId,

        dtoIn.providerPayload,
        dtoIn.providerResponse,
        dtoIn.gatewayResponse,
        dtoIn.metadata,
        dtoIn.config,

        'UpdatePaymentSplitLifecycleUseCase',
      ),
    );

    const recipientsToUpdate =
      dtoIn.recipients.length > 0
        ? dtoIn.recipients
        : this.buildRecipientsFromCurrentList(
            currentRecipientsDtoOut.paymentSplitRecipients,
            dtoIn.status,
          );

    for (const recipient of recipientsToUpdate) {
      const currentRecipient = this.resolveCurrentRecipient(
        recipient,
        currentRecipientsDtoOut.paymentSplitRecipients,
      );

      await this.updatePaymentSplitRecipientStatusService.exec(
        new UpdatePaymentSplitRecipientStatusDtoIn(
          String(currentRecipient._id),
          recipient.status ?? dtoIn.status,

          recipient.gatewayRecipientId,
          recipient.gatewayTransferId,

          recipient.providerPayload,
          recipient.providerResponse,
          recipient.gatewayResponse,
          recipient.metadata,
          recipient.config,

          'UpdatePaymentSplitLifecycleUseCase',
        ),
      );
    }

    const updatedRecipientsDtoOut =
      await this.getAllPaymentSplitRecipientsByPaymentSplitIdService.exec(
        new GetAllPaymentSplitRecipientsByPaymentSplitIdDtoIn(
          dtoIn.paymentSplitId,
        ),
      );

    return new UpdatePaymentSplitLifecycleDtoOut(
      paymentSplitDtoOut.paymentSplit,
      updatedRecipientsDtoOut.paymentSplitRecipients,
    );
  }

  private buildRecipientsFromCurrentList(
    currentRecipients: Array<Record<string, unknown>>,
    status: string,
  ): UpdatePaymentSplitLifecycleRecipientDtoIn[] {
    return currentRecipients.map((recipient) => ({
      paymentSplitRecipientId: String(recipient._id),
      splitRecipientId: String(recipient.splitRecipientId),
      status,

      gatewayRecipientId: null,
      gatewayTransferId: null,

      providerPayload: null,
      providerResponse: null,
      gatewayResponse: null,
      metadata: null,
      config: null,
    }));
  }

  private resolveCurrentRecipient(
    recipient: UpdatePaymentSplitLifecycleRecipientDtoIn,
    currentRecipients: Array<Record<string, unknown>>,
  ): Record<string, unknown> {
    if (recipient.paymentSplitRecipientId !== null) {
      const foundByPaymentSplitRecipientId = currentRecipients.find(
        (current) => String(current._id) === recipient.paymentSplitRecipientId,
      );

      if (foundByPaymentSplitRecipientId) {
        return foundByPaymentSplitRecipientId;
      }
    }

    if (recipient.splitRecipientId !== null) {
      const foundBySplitRecipientId = currentRecipients.find(
        (current) =>
          String(current.splitRecipientId) === recipient.splitRecipientId,
      );

      if (foundBySplitRecipientId) {
        return foundBySplitRecipientId;
      }
    }

    throw new Error('payment split recipient does not belong to payment split');
  }
}
