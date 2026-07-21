import { HandleUseCaseExceptionService } from '../../common/services/use-case-support/handle-use-case-exception.service';
import { FindClientByUniqueIdService } from '../../modules/clients/services/find-client-by-unique-id/find-client-by-unique-id.service';
import { FindOfficeByUniqueIdService } from '../../modules/offices/services/find-office-by-unique-id/find-office-by-unique-id.service';
import { ResolveActorAuthorizationService } from '../../modules/security/services/resolve-actor-authorization/resolve-actor-authorization.service';
import { CreateSubscriptionPlanService } from '../../modules/subscription-plans/services/create-subscription-plan/create-subscription-plan.service';
import { FindSubscriptionPlanBySlugAndOfficeIdService } from '../../modules/subscription-plans/services/find-subscription-plan-by-slug-and-office-id/find-subscription-plan-by-slug-and-office-id.service';
import { RegisterSubscriptionPlanDtoIn } from './dtos/register-subscription-plan.dto-in';
import { RegisterSubscriptionPlanDtoOut } from './dtos/register-subscription-plan.dto-out';
export declare class RegisterSubscriptionPlanUseCase {
    private readonly resolveActorAuthorizationService;
    private readonly findOfficeByUniqueIdService;
    private readonly findClientByUniqueIdService;
    private readonly findSubscriptionPlanBySlugAndOfficeIdService;
    private readonly createSubscriptionPlanService;
    private readonly handleUseCaseExceptionService;
    constructor(resolveActorAuthorizationService: ResolveActorAuthorizationService, findOfficeByUniqueIdService: FindOfficeByUniqueIdService, findClientByUniqueIdService: FindClientByUniqueIdService, findSubscriptionPlanBySlugAndOfficeIdService: FindSubscriptionPlanBySlugAndOfficeIdService, createSubscriptionPlanService: CreateSubscriptionPlanService, handleUseCaseExceptionService: HandleUseCaseExceptionService);
    exec(dtoIn: RegisterSubscriptionPlanDtoIn): Promise<RegisterSubscriptionPlanDtoOut>;
    private validateBillingInterval;
    private validateStatus;
    private validateCurrency;
    private validatePaymentMethods;
    private assertNoSensitiveFields;
}
