import { FindSubscriptionPlanByUniqueIdService } from '../../modules/subscription-plans/services/find-subscription-plan-by-unique-id/find-subscription-plan-by-unique-id.service';
import { ResolveActorAuthorizationService } from '../../modules/security/services/resolve-actor-authorization/resolve-actor-authorization.service';
import { GetSubscriptionPlanByUniqueIdDtoIn } from './dtos/get-subscription-plan-by-unique-id.dto-in';
import { GetSubscriptionPlanByUniqueIdDtoOut } from './dtos/get-subscription-plan-by-unique-id.dto-out';
export declare class GetSubscriptionPlanByUniqueIdUseCase {
    private readonly findSubscriptionPlanByUniqueIdService;
    private readonly resolveActorAuthorizationService;
    constructor(findSubscriptionPlanByUniqueIdService: FindSubscriptionPlanByUniqueIdService, resolveActorAuthorizationService: ResolveActorAuthorizationService);
    exec(dtoIn: GetSubscriptionPlanByUniqueIdDtoIn): Promise<GetSubscriptionPlanByUniqueIdDtoOut>;
}
