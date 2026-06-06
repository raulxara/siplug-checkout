import { GetAllSubscriptionPlansService } from '../../modules/subscription-plans/services/get-all-subscription-plans/get-all-subscription-plans.service';
import { ResolveActorAuthorizationService } from '../../modules/security/services/resolve-actor-authorization/resolve-actor-authorization.service';
import { ListSubscriptionPlansDtoIn } from './dtos/list-subscription-plans.dto-in';
import { ListSubscriptionPlansDtoOut } from './dtos/list-subscription-plans.dto-out';
export declare class ListSubscriptionPlansUseCase {
    private readonly getAllSubscriptionPlansService;
    private readonly resolveActorAuthorizationService;
    constructor(getAllSubscriptionPlansService: GetAllSubscriptionPlansService, resolveActorAuthorizationService: ResolveActorAuthorizationService);
    exec(dtoIn: ListSubscriptionPlansDtoIn): Promise<ListSubscriptionPlansDtoOut>;
}
