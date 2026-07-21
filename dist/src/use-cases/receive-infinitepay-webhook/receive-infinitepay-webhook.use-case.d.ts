import { HandleUseCaseExceptionService } from '../../common/services/use-case-support/handle-use-case-exception.service';
import { NormalizeInfinitePayWebhookService } from '../../modules/payment-webhook-gateways/infinitepay/services/normalize-infinitepay-webhook/normalize-infinitepay-webhook.service';
import { RegisterPaymentWebhookEventService } from '../../modules/payment-webhook-events/services/register-payment-webhook-event/register-payment-webhook-event.service';
import { FindPaymentTransactionByGatewayTransactionIdService } from '../../modules/payment-transactions/services/find-payment-transaction-by-gateway-transaction-id/find-payment-transaction-by-gateway-transaction-id.service';
import { FindPaymentTransactionByUniqueIdService } from '../../modules/payment-transactions/services/find-payment-transaction-by-unique-id/find-payment-transaction-by-unique-id.service';
import { ProcessPaymentWebhookEventUseCase } from '../process-payment-webhook-event/process-payment-webhook-event.use-case';
import { ReceiveInfinitePayWebhookDtoIn } from './dtos/receive-infinitepay-webhook.dto-in';
import { ReceiveInfinitePayWebhookDtoOut } from './dtos/receive-infinitepay-webhook.dto-out';
export declare class ReceiveInfinitePayWebhookUseCase {
    private readonly normalizeInfinitePayWebhookService;
    private readonly registerPaymentWebhookEventService;
    private readonly processPaymentWebhookEventUseCase;
    private readonly findPaymentTransactionByUniqueIdService;
    private readonly findPaymentTransactionByGatewayTransactionIdService;
    private readonly handleUseCaseExceptionService;
    constructor(normalizeInfinitePayWebhookService: NormalizeInfinitePayWebhookService, registerPaymentWebhookEventService: RegisterPaymentWebhookEventService, processPaymentWebhookEventUseCase: ProcessPaymentWebhookEventUseCase, findPaymentTransactionByUniqueIdService: FindPaymentTransactionByUniqueIdService, findPaymentTransactionByGatewayTransactionIdService: FindPaymentTransactionByGatewayTransactionIdService, handleUseCaseExceptionService: HandleUseCaseExceptionService);
    exec(dtoIn: ReceiveInfinitePayWebhookDtoIn): Promise<ReceiveInfinitePayWebhookDtoOut>;
    private enrichNormalizedEventWithPaymentTransactionData;
    private resolvePaymentTransactionFromEvent;
    private findPaymentTransactionByUniqueIdSafe;
    private findPaymentTransactionByGatewayTransactionIdSafe;
    private toNullableString;
}
