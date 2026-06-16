import { Inject, Injectable } from '@nestjs/common';

import { BuildChangesHistoryDtoIn } from '../../../../common/services/changes-history/dtos/build-changes-history.dto-in';
import { BuildChangesHistoryService } from '../../../../common/services/changes-history/build-changes-history.service';

import type {
  IPaymentSplitRecipientsRepository,
  PaymentSplitRecipientRow,
} from '../../entities/payment-split-recipients-repository.interface';
import { PAYMENT_SPLIT_RECIPIENTS_REPOSITORY } from '../../tokens/payment-split-recipients.tokens';

import { UpdatePaymentSplitRecipientDtoIn } from './dtos/update-payment-split-recipient.dto-in';
import { UpdatePaymentSplitRecipientDtoOut } from './dtos/update-payment-split-recipient.dto-out';

@Injectable()
export class UpdatePaymentSplitRecipientService {
  constructor(
    @Inject(PAYMENT_SPLIT_RECIPIENTS_REPOSITORY)
    private readonly repository: IPaymentSplitRecipientsRepository,

    private readonly buildChangesHistoryService: BuildChangesHistoryService,
  ) {}

  async exec(
    dtoIn: UpdatePaymentSplitRecipientDtoIn,
  ): Promise<UpdatePaymentSplitRecipientDtoOut> {
    const current = await this.repository.findByUniqueId(dtoIn._id);

    if (current === null) {
      throw new Error('payment split recipient not found');
    }

    const newData = this.buildNewData(dtoIn);

    const historyDtoOut = this.buildChangesHistoryService.exec(
      new BuildChangesHistoryDtoIn({
        currentChangesHistory: current.changesHistory,
        oldData: this.buildOldData(current),
        newData,
        source: dtoIn.source,
      }),
    );

    const updated = await this.repository.updateByUniqueId(dtoIn._id, {
      ...this.buildRepositoryUpdateData(dtoIn),
      changes_history: historyDtoOut.hasChanges
        ? historyDtoOut.changesHistory
        : current.changesHistory,
    });

    return new UpdatePaymentSplitRecipientDtoOut(
      updated as unknown as Record<string, unknown>,
    );
  }

  private buildNewData(
    dtoIn: UpdatePaymentSplitRecipientDtoIn,
  ): Record<string, unknown> {
    const data: Record<string, unknown> = {};

    if (
      dtoIn.gatewayRecipientId !== undefined &&
      dtoIn.gatewayRecipientId !== null
    ) {
      data.gatewayRecipientId = dtoIn.gatewayRecipientId;
    }

    if (
      dtoIn.gatewayTransferId !== undefined &&
      dtoIn.gatewayTransferId !== null
    ) {
      data.gatewayTransferId = dtoIn.gatewayTransferId;
    }

    if (dtoIn.providerPayload !== undefined && dtoIn.providerPayload !== null) {
      data.providerPayload = dtoIn.providerPayload;
    }

    if (
      dtoIn.providerResponse !== undefined &&
      dtoIn.providerResponse !== null
    ) {
      data.providerResponse = dtoIn.providerResponse;
    }

    if (dtoIn.gatewayResponse !== undefined && dtoIn.gatewayResponse !== null) {
      data.gatewayResponse = dtoIn.gatewayResponse;
    }

    if (dtoIn.metadata !== undefined && dtoIn.metadata !== null) {
      data.metadata = dtoIn.metadata;
    }

    if (dtoIn.config !== undefined && dtoIn.config !== null) {
      data.config = dtoIn.config;
    }

    if (dtoIn.status !== undefined) {
      data.status = dtoIn.status;
    }

    return data;
  }

  private buildRepositoryUpdateData(
    dtoIn: UpdatePaymentSplitRecipientDtoIn,
  ): Record<string, unknown> {
    const data: Record<string, unknown> = {};

    if (
      dtoIn.gatewayRecipientId !== undefined &&
      dtoIn.gatewayRecipientId !== null
    ) {
      data.gateway_recipient_id = dtoIn.gatewayRecipientId;
    }

    if (
      dtoIn.gatewayTransferId !== undefined &&
      dtoIn.gatewayTransferId !== null
    ) {
      data.gateway_transfer_id = dtoIn.gatewayTransferId;
    }

    if (dtoIn.providerPayload !== undefined && dtoIn.providerPayload !== null) {
      data.provider_payload = dtoIn.providerPayload;
    }

    if (
      dtoIn.providerResponse !== undefined &&
      dtoIn.providerResponse !== null
    ) {
      data.provider_response = dtoIn.providerResponse;
    }

    if (dtoIn.gatewayResponse !== undefined && dtoIn.gatewayResponse !== null) {
      data.gateway_response = dtoIn.gatewayResponse;
    }

    if (dtoIn.metadata !== undefined && dtoIn.metadata !== null) {
      data.metadata = dtoIn.metadata;
    }

    if (dtoIn.config !== undefined && dtoIn.config !== null) {
      data.config = dtoIn.config;
    }

    if (dtoIn.status !== undefined) {
      data.status = dtoIn.status;
    }

    return data;
  }

  private buildOldData(
    row: PaymentSplitRecipientRow,
  ): Record<string, unknown> {
    return {
      gatewayRecipientId: row.gatewayRecipientId,
      gatewayTransferId: row.gatewayTransferId,
      providerPayload: row.providerPayload,
      providerResponse: row.providerResponse,
      gatewayResponse: row.gatewayResponse,
      metadata: row.metadata,
      config: row.config,
      status: row.status,
    };
  }
}
