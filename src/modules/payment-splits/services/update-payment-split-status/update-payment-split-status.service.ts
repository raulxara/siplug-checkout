import { Inject, Injectable } from '@nestjs/common';

import { BuildChangesHistoryService } from '../../../../common/services/changes-history/build-changes-history.service';
import type { IPaymentSplitsRepository } from '../../entities/payment-splits-repository.interface';
import { PAYMENT_SPLITS_REPOSITORY } from '../../tokens/payment-splits.tokens';
import { UpdatePaymentSplitStatusDtoIn } from './dtos/update-payment-split-status.dto-in';
import { UpdatePaymentSplitStatusDtoOut } from './dtos/update-payment-split-status.dto-out';

@Injectable()
export class UpdatePaymentSplitStatusService {
  constructor(
    @Inject(PAYMENT_SPLITS_REPOSITORY)
    private readonly paymentSplitsRepository: IPaymentSplitsRepository,

    private readonly buildChangesHistoryService: BuildChangesHistoryService,
  ) {}

  async exec(
    dtoIn: UpdatePaymentSplitStatusDtoIn,
  ): Promise<UpdatePaymentSplitStatusDtoOut> {
    const current = await this.paymentSplitsRepository.findByUniqueId(
      dtoIn._id,
    );

    if (current === null) {
      throw new Error('payment split not found');
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

    const updated = await this.paymentSplitsRepository.updateByUniqueId(
      dtoIn._id,
      {
        gateway_split_id: dtoIn.gatewaySplitId,

        provider_payload: dtoIn.providerPayload,
        provider_response: dtoIn.providerResponse,
        gateway_response: dtoIn.gatewayResponse,
        metadata: dtoIn.metadata,
        config: dtoIn.config,

        changes_history: changesHistory,
        status: dtoIn.status,
      },
    );

    return new UpdatePaymentSplitStatusDtoOut(
      updated as unknown as Record<string, unknown>,
    );
  }

  private buildNewDataForHistory(
    dtoIn: UpdatePaymentSplitStatusDtoIn,
  ): Record<string, unknown> {
    const newData: Record<string, unknown> = {};

    this.addIfNotNull(newData, 'gatewaySplitId', dtoIn.gatewaySplitId);
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
      throw new Error(`invalid payment split status: ${status}`);
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
        `invalid payment split status transition from ${currentStatus} to ${nextStatus}`,
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
