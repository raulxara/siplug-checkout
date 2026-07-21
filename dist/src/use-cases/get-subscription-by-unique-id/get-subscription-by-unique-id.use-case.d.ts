import { FindSubscriptionByUniqueIdService } from '../../modules/subscriptions/services/find-subscription-by-unique-id/find-subscription-by-unique-id.service';
import { ResolveActorAuthorizationService } from '../../modules/security/services/resolve-actor-authorization/resolve-actor-authorization.service';
import { GetSubscriptionByUniqueIdDtoIn } from './dtos/get-subscription-by-unique-id.dto-in';
import { GetSubscriptionByUniqueIdDtoOut } from './dtos/get-subscription-by-unique-id.dto-out';
export declare class GetSubscriptionByUniqueIdUseCase {
    private readonly findSubscriptionByUniqueIdService;
    private readonly resolveActorAuthorizationService;
    constructor(findSubscriptionByUniqueIdService: FindSubscriptionByUniqueIdService, resolveActorAuthorizationService: ResolveActorAuthorizationService);
    exec(dtoIn: GetSubscriptionByUniqueIdDtoIn): Promise<GetSubscriptionByUniqueIdDtoOut>;
}
