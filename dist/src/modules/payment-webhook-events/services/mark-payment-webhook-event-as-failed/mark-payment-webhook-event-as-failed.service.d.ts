import { BuildChangesHistoryService } from '../../../../common/services/changes-history/build-changes-history.service';
import type { IPaymentWebhookEventsRepository } from '../../entities/payment-webhook-events-repository.interface';
import { MarkPaymentWebhookEventAsFailedDtoIn } from './dtos/mark-payment-webhook-event-as-failed.dto-in';
import { MarkPaymentWebhookEventAsFailedDtoOut } from './dtos/mark-payment-webhook-event-as-failed.dto-out';
export declare class MarkPaymentWebhookEventAsFailedService {
    private readonly repository;
    private readonly buildChangesHistoryService;
    constructor(repository: IPaymentWebhookEventsRepository, buildChangesHistoryService: BuildChangesHistoryService);
    exec(dtoIn: MarkPaymentWebhookEventAsFailedDtoIn): Promise<MarkPaymentWebhookEventAsFailedDtoOut>;
    private buildOldData;
}
