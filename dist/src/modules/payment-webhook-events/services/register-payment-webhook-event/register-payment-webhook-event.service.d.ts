import type { IPaymentWebhookEventsRepository } from '../../entities/payment-webhook-events-repository.interface';
import { RegisterPaymentWebhookEventDtoIn } from './dtos/register-payment-webhook-event.dto-in';
import { RegisterPaymentWebhookEventDtoOut } from './dtos/register-payment-webhook-event.dto-out';
export declare class RegisterPaymentWebhookEventService {
    private readonly repository;
    constructor(repository: IPaymentWebhookEventsRepository);
    exec(dtoIn: RegisterPaymentWebhookEventDtoIn): Promise<RegisterPaymentWebhookEventDtoOut>;
}
