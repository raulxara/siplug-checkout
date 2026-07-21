import { BuildChangesHistoryService } from '../../../../common/services/changes-history/build-changes-history.service';
import type { IPaymentWebhookEventsRepository } from '../../entities/payment-webhook-events-repository.interface';
import { MarkPaymentWebhookEventAsProcessingDtoIn } from './dtos/mark-payment-webhook-event-as-processing.dto-in';
import { MarkPaymentWebhookEventAsProcessingDtoOut } from './dtos/mark-payment-webhook-event-as-processing.dto-out';
export declare class MarkPaymentWebhookEventAsProcessingService {
    private readonly repository;
    private readonly buildChangesHistoryService;
    constructor(repository: IPaymentWebhookEventsRepository, buildChangesHistoryService: BuildChangesHistoryService);
    exec(dtoIn: MarkPaymentWebhookEventAsProcessingDtoIn): Promise<MarkPaymentWebhookEventAsProcessingDtoOut>;
    private buildOldData;
}
