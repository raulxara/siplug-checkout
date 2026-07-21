import { HandleUseCaseExceptionService } from '../../common/services/use-case-support/handle-use-case-exception.service';
import { FindApiCredentialByUniqueIdService } from '../../modules/api-credentials/services/find-api-credential-by-unique-id/find-api-credential-by-unique-id.service';
import { FindClientByUniqueIdService } from '../../modules/clients/services/find-client-by-unique-id/find-client-by-unique-id.service';
import { CreateCheckoutSessionItemService } from '../../modules/checkout-sessions/services/create-checkout-session-item/create-checkout-session-item.service';
import { CreateCheckoutSessionService } from '../../modules/checkout-sessions/services/create-checkout-session/create-checkout-session.service';
import { UpdateCheckoutSessionService } from '../../modules/checkout-sessions/services/update-checkout-session/update-checkout-session.service';
import { FindGatewayByUniqueIdService } from '../../modules/gateways/services/find-gateway-by-unique-id/find-gateway-by-unique-id.service';
import { FindOfficeByUniqueIdService } from '../../modules/offices/services/find-office-by-unique-id/find-office-by-unique-id.service';
import { FindPaymentCustomerByUniqueIdService } from '../../modules/payment-customers/services/find-payment-customer-by-unique-id/find-payment-customer-by-unique-id.service';
import { ResolveActorAuthorizationService } from '../../modules/security/services/resolve-actor-authorization/resolve-actor-authorization.service';
import { RegisterCheckoutSessionDtoIn } from './dtos/register-checkout-session.dto-in';
import { RegisterCheckoutSessionDtoOut } from './dtos/register-checkout-session.dto-out';
export declare class RegisterCheckoutSessionUseCase {
    private readonly resolveActorAuthorizationService;
    private readonly findOfficeByUniqueIdService;
    private readonly findClientByUniqueIdService;
    private readonly findPaymentCustomerByUniqueIdService;
    private readonly findGatewayByUniqueIdService;
    private readonly findApiCredentialByUniqueIdService;
    private readonly createCheckoutSessionService;
    private readonly updateCheckoutSessionService;
    private readonly createCheckoutSessionItemService;
    private readonly handleUseCaseExceptionService;
    constructor(resolveActorAuthorizationService: ResolveActorAuthorizationService, findOfficeByUniqueIdService: FindOfficeByUniqueIdService, findClientByUniqueIdService: FindClientByUniqueIdService, findPaymentCustomerByUniqueIdService: FindPaymentCustomerByUniqueIdService, findGatewayByUniqueIdService: FindGatewayByUniqueIdService, findApiCredentialByUniqueIdService: FindApiCredentialByUniqueIdService, createCheckoutSessionService: CreateCheckoutSessionService, updateCheckoutSessionService: UpdateCheckoutSessionService, createCheckoutSessionItemService: CreateCheckoutSessionItemService, handleUseCaseExceptionService: HandleUseCaseExceptionService);
    exec(dtoIn: RegisterCheckoutSessionDtoIn): Promise<RegisterCheckoutSessionDtoOut>;
    private validatePaymentType;
    private validateItemsTotal;
    private validateGatewayCapabilities;
}
