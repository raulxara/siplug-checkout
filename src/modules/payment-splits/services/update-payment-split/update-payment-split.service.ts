import { Inject, Injectable } from '@nestjs/common';

import { BuildChangesHistoryDtoIn } from '../../../../common/services/changes-history/dtos/build-changes-history.dto-in';
import { BuildChangesHistoryService } from '../../../../common/services/changes-history/build-changes-history.service';

import type {
  IPaymentSplitsRepository,
  PaymentSplitRow,
} from '../../entities/payment-splits-repository.interface';
import { PAYMENT_SPLITS_REPOSITORY } from '../../tokens/payment-splits.tokens';

import { UpdatePaymentSplitDtoIn } from './dtos/update-payment-split.dto-in';
import { UpdatePaymentSplitDtoOut } from './dtos/update-payment-split.dto-out';

@Injectable()
export class UpdatePaymentSplitService {
  constructor(
    @Inject(PAYMENT_SPLITS_REPOSITORY)
    private readonly repository: IPaymentSplitsRepository,

    private readonly buildChangesHistoryService: BuildChangesHistoryService,
  ) {}

  async exec(dtoIn: UpdatePaymentSplitDtoIn): Promise<UpdatePaymentSplitDtoOut> {
    const current = await this.repository.findByUniqueId(dtoIn._id);

    if (current === null) {
      throw new Error('payment split not found');
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

    return new UpdatePaymentSplitDtoOut(
      updated as unknown as Record<string, unknown>,
    );
  }

  private buildNewData(dtoIn: UpdatePaymentSplitDtoIn): Record<string, unknown> {
    const data: Record<string, unknown> = {};

    if (dtoIn.gatewaySplitId !== undefined && dtoIn.gatewaySplitId !== null) {
      data.gatewaySplitId = dtoIn.gatewaySplitId;
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
    dtoIn: UpdatePaymentSplitDtoIn,
  ): Record<string, unknown> {
    const data: Record<string, unknown> = {};

    if (dtoIn.gatewaySplitId !== undefined && dtoIn.gatewaySplitId !== null) {
      data.gateway_split_id = dtoIn.gatewaySplitId;
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

  private buildOldData(row: PaymentSplitRow): Record<string, unknown> {
    return {
      gatewaySplitId: row.gatewaySplitId,
      providerPayload: row.providerPayload,
      providerResponse: row.providerResponse,
      gatewayResponse: row.gatewayResponse,
      metadata: row.metadata,
      config: row.config,
      status: row.status,
    };
  }
}
