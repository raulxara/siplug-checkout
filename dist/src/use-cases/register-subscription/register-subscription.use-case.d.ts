import { HandleUseCaseExceptionService } from '../../common/services/use-case-support/handle-use-case-exception.service';
import { ResolveActorAuthorizationService } from '../../modules/security/services/resolve-actor-authorization/resolve-actor-authorization.service';
import { FindSubscriptionPlanByUniqueIdService } from '../../modules/subscription-plans/services/find-subscription-plan-by-unique-id/find-subscription-plan-by-unique-id.service';
import { CreateSubscriptionService } from '../../modules/subscriptions/services/create-subscription/create-subscription.service';
import { FindSubscriptionByExternalReferenceAndOfficeIdService } from '../../modules/subscriptions/services/find-subscription-by-external-reference-and-office-id/find-subscription-by-external-reference-and-office-id.service';
import { RegisterSubscriptionDtoIn } from './dtos/register-subscription.dto-in';
import { RegisterSubscriptionDtoOut } from './dtos/register-subscription.dto-out';
export declare class RegisterSubscriptionUseCase {
    private readonly resolveActorAuthorizationService;
    private readonly findSubscriptionPlanByUniqueIdService;
    private readonly findSubscriptionByExternalReferenceAndOfficeIdService;
    private readonly createSubscriptionService;
    private readonly handleUseCaseExceptionService;
    constructor(resolveActorAuthorizationService: ResolveActorAuthorizationService, findSubscriptionPlanByUniqueIdService: FindSubscriptionPlanByUniqueIdService, findSubscriptionByExternalReferenceAndOfficeIdService: FindSubscriptionByExternalReferenceAndOfficeIdService, createSubscriptionService: CreateSubscriptionService, handleUseCaseExceptionService: HandleUseCaseExceptionService);
    exec(dtoIn: RegisterSubscriptionDtoIn): Promise<RegisterSubscriptionDtoOut>;
    private resolveInitialNextBillingAt;
    private validateStatus;
    private assertNoSensitiveFields;
}
