import { Inject, Injectable } from '@nestjs/common';

import { BuildChangesHistoryDtoIn } from '../../../../common/services/changes-history/dtos/build-changes-history.dto-in';
import { BuildChangesHistoryService } from '../../../../common/services/changes-history/build-changes-history.service';
import type {
  IPaymentWebhookEventsRepository,
  PaymentWebhookEventRow,
} from '../../entities/payment-webhook-events-repository.interface';
import { PAYMENT_WEBHOOK_EVENTS_REPOSITORY } from '../../tokens/payment-webhook-events.tokens';
import { MarkPaymentWebhookEventAsProcessingDtoIn } from './dtos/mark-payment-webhook-event-as-processing.dto-in';
import { MarkPaymentWebhookEventAsProcessingDtoOut } from './dtos/mark-payment-webhook-event-as-processing.dto-out';

@Injectable()
export class MarkPaymentWebhookEventAsProcessingService {
  constructor(
    @Inject(PAYMENT_WEBHOOK_EVENTS_REPOSITORY)
    private readonly repository: IPaymentWebhookEventsRepository,

    private readonly buildChangesHistoryService: BuildChangesHistoryService,
  ) {}

  async exec(
    dtoIn: MarkPaymentWebhookEventAsProcessingDtoIn,
  ): Promise<MarkPaymentWebhookEventAsProcessingDtoOut> {
    const current = await this.repository.findByUniqueId(dtoIn._id);

    if (current === null) {
      throw new Error('payment webhook event not found');
    }

    if (current.status === 'processed') {
      return new MarkPaymentWebhookEventAsProcessingDtoOut(
        current as unknown as Record<string, unknown>,
      );
    }

    const newData = {
      status: 'processing',
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
      changes_history: historyDtoOut.hasChanges
        ? historyDtoOut.changesHistory
        : current.changesHistory,
      status: 'processing',
    });

    return new MarkPaymentWebhookEventAsProcessingDtoOut(
      updated as unknown as Record<string, unknown>,
    );
  }

  private buildOldData(row: PaymentWebhookEventRow): Record<string, unknown> {
    return {
      status: row.status,
    };
  }
}
