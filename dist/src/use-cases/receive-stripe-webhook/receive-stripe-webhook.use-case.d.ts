import { DecryptApiCredentialSecretService } from '../../common/services/crypto/decrypt-api-credential-secret/decrypt-api-credential-secret.service';
import { HandleUseCaseExceptionService } from '../../common/services/use-case-support/handle-use-case-exception.service';
import { FindApiCredentialByUniqueIdService } from '../../modules/api-credentials/services/find-api-credential-by-unique-id/find-api-credential-by-unique-id.service';
import { NormalizeStripeWebhookService } from '../../modules/payment-webhook-gateways/stripe/services/normalize-stripe-webhook/normalize-stripe-webhook.service';
import { ValidateStripeWebhookService } from '../../modules/payment-webhook-gateways/stripe/services/validate-stripe-webhook/validate-stripe-webhook.service';
import { RegisterPaymentWebhookEventService } from '../../modules/payment-webhook-events/services/register-payment-webhook-event/register-payment-webhook-event.service';
import { ProcessPaymentWebhookEventUseCase } from '../process-payment-webhook-event/process-payment-webhook-event.use-case';
import { ReceiveStripeWebhookDtoIn } from './dtos/receive-stripe-webhook.dto-in';
import { ReceiveStripeWebhookDtoOut } from './dtos/receive-stripe-webhook.dto-out';
export declare class ReceiveStripeWebhookUseCase {
    private readonly findApiCredentialByUniqueIdService;
    private readonly decryptApiCredentialSecretService;
    private readonly validateStripeWebhookService;
    private readonly normalizeStripeWebhookService;
    private readonly registerPaymentWebhookEventService;
    private readonly processPaymentWebhookEventUseCase;
    private readonly handleUseCaseExceptionService;
    constructor(findApiCredentialByUniqueIdService: FindApiCredentialByUniqueIdService, decryptApiCredentialSecretService: DecryptApiCredentialSecretService, validateStripeWebhookService: ValidateStripeWebhookService, normalizeStripeWebhookService: NormalizeStripeWebhookService, registerPaymentWebhookEventService: RegisterPaymentWebhookEventService, processPaymentWebhookEventUseCase: ProcessPaymentWebhookEventUseCase, handleUseCaseExceptionService: HandleUseCaseExceptionService);
    exec(dtoIn: ReceiveStripeWebhookDtoIn): Promise<ReceiveStripeWebhookDtoOut>;
    private resolveEndpointSecretFromApiCredential;
    private extractStringFromConfig;
}
