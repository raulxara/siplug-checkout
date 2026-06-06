import { FindSubscriptionByUniqueIdService } from '../../modules/subscriptions/services/find-subscription-by-unique-id/find-subscription-by-unique-id.service';
import { UpdateSubscriptionService } from '../../modules/subscriptions/services/update-subscription/update-subscription.service';
import { ResolveActorAuthorizationService } from '../../modules/security/services/resolve-actor-authorization/resolve-actor-authorization.service';
import { UpdateSubscriptionDtoIn } from './dtos/update-subscription.dto-in';
import { UpdateSubscriptionDtoOut } from './dtos/update-subscription.dto-out';
export declare class UpdateSubscriptionUseCase {
    private readonly findSubscriptionByUniqueIdService;
    private readonly updateSubscriptionService;
    private readonly resolveActorAuthorizationService;
    constructor(findSubscriptionByUniqueIdService: FindSubscriptionByUniqueIdService, updateSubscriptionService: UpdateSubscriptionService, resolveActorAuthorizationService: ResolveActorAuthorizationService);
    exec(dtoIn: UpdateSubscriptionDtoIn): Promise<UpdateSubscriptionDtoOut>;
}
