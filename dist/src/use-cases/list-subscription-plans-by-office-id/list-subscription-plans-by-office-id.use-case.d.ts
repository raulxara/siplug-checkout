import { GetAuthContextUseCase } from '../get-auth-context/get-auth-context.use-case';
import { GetAllSubscriptionPlansByOfficeIdService } from '../../modules/subscription-plans/services/get-all-subscription-plans-by-office-id/get-all-subscription-plans-by-office-id.service';
import { ResolveActorAuthorizationService } from '../../modules/security/services/resolve-actor-authorization/resolve-actor-authorization.service';
import { ListSubscriptionPlansByOfficeIdDtoIn } from './dtos/list-subscription-plans-by-office-id.dto-in';
import { ListSubscriptionPlansByOfficeIdDtoOut } from './dtos/list-subscription-plans-by-office-id.dto-out';
export declare class ListSubscriptionPlansByOfficeIdUseCase {
    private readonly identity;
    private readonly getAllSubscriptionPlansByOfficeIdService;
    private readonly resolveActorAuthorizationService;
    constructor(identity: GetAuthContextUseCase, getAllSubscriptionPlansByOfficeIdService: GetAllSubscriptionPlansByOfficeIdService, resolveActorAuthorizationService: ResolveActorAuthorizationService);
    exec(dtoIn: ListSubscriptionPlansByOfficeIdDtoIn): Promise<ListSubscriptionPlansByOfficeIdDtoOut>;
}
