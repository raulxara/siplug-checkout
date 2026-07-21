import { FindSubscriptionPlanByUniqueIdService } from '../../modules/subscription-plans/services/find-subscription-plan-by-unique-id/find-subscription-plan-by-unique-id.service';
import { UpdateSubscriptionPlanService } from '../../modules/subscription-plans/services/update-subscription-plan/update-subscription-plan.service';
import { ResolveActorAuthorizationService } from '../../modules/security/services/resolve-actor-authorization/resolve-actor-authorization.service';
import { UpdateSubscriptionPlanDtoIn } from './dtos/update-subscription-plan.dto-in';
import { UpdateSubscriptionPlanDtoOut } from './dtos/update-subscription-plan.dto-out';
export declare class UpdateSubscriptionPlanUseCase {
    private readonly findSubscriptionPlanByUniqueIdService;
    private readonly updateSubscriptionPlanService;
    private readonly resolveActorAuthorizationService;
    constructor(findSubscriptionPlanByUniqueIdService: FindSubscriptionPlanByUniqueIdService, updateSubscriptionPlanService: UpdateSubscriptionPlanService, resolveActorAuthorizationService: ResolveActorAuthorizationService);
    exec(dtoIn: UpdateSubscriptionPlanDtoIn): Promise<UpdateSubscriptionPlanDtoOut>;
}
