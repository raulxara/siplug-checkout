import { GetAuthContextUseCase } from '../get-auth-context/get-auth-context.use-case';
import { GetAllSubscriptionsByOfficeIdService } from '../../modules/subscriptions/services/get-all-subscriptions-by-office-id/get-all-subscriptions-by-office-id.service';
import { ResolveActorAuthorizationService } from '../../modules/security/services/resolve-actor-authorization/resolve-actor-authorization.service';
import { ListSubscriptionsByOfficeIdDtoIn } from './dtos/list-subscriptions-by-office-id.dto-in';
import { ListSubscriptionsByOfficeIdDtoOut } from './dtos/list-subscriptions-by-office-id.dto-out';
export declare class ListSubscriptionsByOfficeIdUseCase {
    private readonly identity;
    private readonly getAllSubscriptionsByOfficeIdService;
    private readonly resolveActorAuthorizationService;
    constructor(identity: GetAuthContextUseCase, getAllSubscriptionsByOfficeIdService: GetAllSubscriptionsByOfficeIdService, resolveActorAuthorizationService: ResolveActorAuthorizationService);
    exec(dtoIn: ListSubscriptionsByOfficeIdDtoIn): Promise<ListSubscriptionsByOfficeIdDtoOut>;
}
