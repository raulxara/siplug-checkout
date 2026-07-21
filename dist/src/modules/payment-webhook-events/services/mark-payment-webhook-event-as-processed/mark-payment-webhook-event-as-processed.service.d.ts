import { BuildChangesHistoryService } from '../../../../common/services/changes-history/build-changes-history.service';
import type { IPaymentWebhookEventsRepository } from '../../entities/payment-webhook-events-repository.interface';
import { MarkPaymentWebhookEventAsProcessedDtoIn } from './dtos/mark-payment-webhook-event-as-processed.dto-in';
import { MarkPaymentWebhookEventAsProcessedDtoOut } from './dtos/mark-payment-webhook-event-as-processed.dto-out';
export declare class MarkPaymentWebhookEventAsProcessedService {
    private readonly repository;
    private readonly buildChangesHistoryService;
    constructor(repository: IPaymentWebhookEventsRepository, buildChangesHistoryService: BuildChangesHistoryService);
    exec(dtoIn: MarkPaymentWebhookEventAsProcessedDtoIn): Promise<MarkPaymentWebhookEventAsProcessedDtoOut>;
    private buildOldData;
}
