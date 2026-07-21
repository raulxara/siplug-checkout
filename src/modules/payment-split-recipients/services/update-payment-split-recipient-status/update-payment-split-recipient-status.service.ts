import { Inject, Injectable } from '@nestjs/common';

import { BuildChangesHistoryService } from '../../../../common/services/changes-history/build-changes-history.service';
import type { IPaymentSplitRecipientsRepository } from '../../entities/payment-split-recipients-repository.interface';
import { PAYMENT_SPLIT_RECIPIENTS_REPOSITORY } from '../../tokens/payment-split-recipients.tokens';
import { UpdatePaymentSplitRecipientStatusDtoIn } from './dtos/update-payment-split-recipient-status.dto-in';
import { UpdatePaymentSplitRecipientStatusDtoOut } from './dtos/update-payment-split-recipient-status.dto-out';

@Injectable()
export class UpdatePaymentSplitRecipientStatusService {
  constructor(
    @Inject(PAYMENT_SPLIT_RECIPIENTS_REPOSITORY)
    private readonly paymentSplitRecipientsRepository: IPaymentSplitRecipientsRepository,

    private readonly buildChangesHistoryService: BuildChangesHistoryService,
  ) {}

  async exec(
    dtoIn: UpdatePaymentSplitRecipientStatusDtoIn,
  ): Promise<UpdatePaymentSplitRecipientStatusDtoOut> {
    const current =
      await this.paymentSplitRecipientsRepository.findByUniqueId(dtoIn._id);

    if (current === null) {
      throw new Error('payment split recipient not found');
    }

    this.validateStatus(dtoIn.status);
    this.validateTransition(current.status, dtoIn.status);

    const newDataForHistory = this.buildNewDataForHistory(dtoIn);

    const changesHistory = this.buildChangesHistoryService.exec({
      currentChangesHistory: current.changesHistory ?? null,
      oldData: current as unknown as Record<string, unknown>,
      newData: newDataForHistory,
      source: dtoIn.source,
    });

    const updated =
      await this.paymentSplitRecipientsRepository.updateByUniqueId(dtoIn._id, {
        gateway_recipient_id: dtoIn.gatewayRecipientId,
        gateway_transfer_id: dtoIn.gatewayTransferId,

        provider_payload: dtoIn.providerPayload,
        provider_response: dtoIn.providerResponse,
        gateway_response: dtoIn.gatewayResponse,
        metadata: dtoIn.metadata,
        config: dtoIn.config,

        changes_history: changesHistory,
        status: dtoIn.status,
      });

    return new UpdatePaymentSplitRecipientStatusDtoOut(
      updated as unknown as Record<string, unknown>,
    );
  }

  private buildNewDataForHistory(
    dtoIn: UpdatePaymentSplitRecipientStatusDtoIn,
  ): Record<string, unknown> {
    const newData: Record<string, unknown> = {};

    this.addIfNotNull(newData, 'gatewayRecipientId', dtoIn.gatewayRecipientId);
    this.addIfNotNull(newData, 'gatewayTransferId', dtoIn.gatewayTransferId);
    this.addIfNotNull(newData, 'providerPayload', dtoIn.providerPayload);
    this.addIfNotNull(newData, 'providerResponse', dtoIn.providerResponse);
    this.addIfNotNull(newData, 'gatewayResponse', dtoIn.gatewayResponse);
    this.addIfNotNull(newData, 'metadata', dtoIn.metadata);
    this.addIfNotNull(newData, 'config', dtoIn.config);
    this.addIfNotNull(newData, 'status', dtoIn.status);

    return newData;
  }

  private validateStatus(status: string): void {
    const allowedStatuses = [
      'created',
      'pending_gateway',
      'transferred',
      'failed',
      'refunded',
    ];

    if (!allowedStatuses.includes(status)) {
      throw new Error(`invalid payment split recipient status: ${status}`);
    }
  }

  private validateTransition(currentStatus: string, nextStatus: string): void {
    if (currentStatus === nextStatus) {
      return;
    }

    const transitions: Record<string, string[]> = {
      created: ['pending_gateway', 'transferred', 'failed', 'refunded'],
      pending_gateway: ['transferred', 'failed', 'refunded'],
      transferred: ['refunded'],
      failed: [],
      refunded: [],
    };

    const allowedNextStatuses = transitions[currentStatus] ?? [];

    if (!allowedNextStatuses.includes(nextStatus)) {
      throw new Error(
        `invalid payment split recipient status transition from ${currentStatus} to ${nextStatus}`,
      );
    }
  }

  private addIfNotNull(
    target: Record<string, unknown>,
    key: string,
    value: unknown,
  ): void {
    if (value !== null && value !== undefined) {
      target[key] = value;
    }
  }
}
