import { GetAllSubscriptionsService } from '../../modules/subscriptions/services/get-all-subscriptions/get-all-subscriptions.service';
import { ResolveActorAuthorizationService } from '../../modules/security/services/resolve-actor-authorization/resolve-actor-authorization.service';
import { ListSubscriptionsDtoIn } from './dtos/list-subscriptions.dto-in';
import { ListSubscriptionsDtoOut } from './dtos/list-subscriptions.dto-out';
export declare class ListSubscriptionsUseCase {
    private readonly getAllSubscriptionsService;
    private readonly resolveActorAuthorizationService;
    constructor(getAllSubscriptionsService: GetAllSubscriptionsService, resolveActorAuthorizationService: ResolveActorAuthorizationService);
    exec(dtoIn: ListSubscriptionsDtoIn): Promise<ListSubscriptionsDtoOut>;
}
