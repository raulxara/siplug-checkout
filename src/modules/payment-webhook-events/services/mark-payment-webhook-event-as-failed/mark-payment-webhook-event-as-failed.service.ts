import { Inject, Injectable } from '@nestjs/common';

import { BuildChangesHistoryDtoIn } from '../../../../common/services/changes-history/dtos/build-changes-history.dto-in';
import { BuildChangesHistoryService } from '../../../../common/services/changes-history/build-changes-history.service';
import type {
  IPaymentWebhookEventsRepository,
  PaymentWebhookEventRow,
} from '../../entities/payment-webhook-events-repository.interface';
import { PAYMENT_WEBHOOK_EVENTS_REPOSITORY } from '../../tokens/payment-webhook-events.tokens';
import { MarkPaymentWebhookEventAsFailedDtoIn } from './dtos/mark-payment-webhook-event-as-failed.dto-in';
import { MarkPaymentWebhookEventAsFailedDtoOut } from './dtos/mark-payment-webhook-event-as-failed.dto-out';

@Injectable()
export class MarkPaymentWebhookEventAsFailedService {
  constructor(
    @Inject(PAYMENT_WEBHOOK_EVENTS_REPOSITORY)
    private readonly repository: IPaymentWebhookEventsRepository,

    private readonly buildChangesHistoryService: BuildChangesHistoryService,
  ) {}

  async exec(
    dtoIn: MarkPaymentWebhookEventAsFailedDtoIn,
  ): Promise<MarkPaymentWebhookEventAsFailedDtoOut> {
    const current = await this.repository.findByUniqueId(dtoIn._id);

    if (current === null) {
      throw new Error('payment webhook event not found');
    }

    const processedAt = new Date().toISOString();

    const newData = {
      errorMessage: dtoIn.errorMessage,
      processingResult: dtoIn.processingResult,
      processedAt,
      status: 'failed',
    };

    const historyDtoOut = this.buildChangesHistoryService.exec(
      new BuildChangesHistoryDtoIn({
        currentChangesHistory: current.changesHistory,
        oldData: this.buildOldData(current),
        newData,
        source: dtoIn.source,
      }),
    );

    const updated = await this.repository.updateByUniqueId(dtoIn._id, {
      error_message: dtoIn.errorMessage,
      processing_result: dtoIn.processingResult,
      processed_at: processedAt,
      changes_history: historyDtoOut.hasChanges
        ? historyDtoOut.changesHistory
        : current.changesHistory,
      status: 'failed',
    });

    return new MarkPaymentWebhookEventAsFailedDtoOut(
      updated as unknown as Record<string, unknown>,
    );
  }

  private buildOldData(row: PaymentWebhookEventRow): Record<string, unknown> {
    return {
      errorMessage: row.errorMessage,
      processingResult: row.processingResult,
      processedAt: row.processedAt,
      status: row.status,
    };
  }
}
