import { HandleUseCaseExceptionService } from '../../common/services/use-case-support/handle-use-case-exception.service';
import { GetAllCheckoutSessionItemsByCheckoutSessionIdService } from '../../modules/checkout-sessions/services/get-all-checkout-session-items-by-checkout-session-id/get-all-checkout-session-items-by-checkout-session-id.service';
import { GetAllCheckoutSessionsByOfficeIdService } from '../../modules/checkout-sessions/services/get-all-checkout-sessions-by-office-id/get-all-checkout-sessions-by-office-id.service';
import { FindOfficeByUniqueIdService } from '../../modules/offices/services/find-office-by-unique-id/find-office-by-unique-id.service';
import { ResolveActorAuthorizationService } from '../../modules/security/services/resolve-actor-authorization/resolve-actor-authorization.service';
import { ListCheckoutSessionsDtoIn } from './dtos/list-checkout-sessions.dto-in';
import { ListCheckoutSessionsDtoOut } from './dtos/list-checkout-sessions.dto-out';
export declare class ListCheckoutSessionsUseCase {
    private readonly resolveActorAuthorizationService;
    private readonly findOfficeByUniqueIdService;
    private readonly getAllCheckoutSessionsByOfficeIdService;
    private readonly getAllCheckoutSessionItemsByCheckoutSessionIdService;
    private readonly handleUseCaseExceptionService;
    constructor(resolveActorAuthorizationService: ResolveActorAuthorizationService, findOfficeByUniqueIdService: FindOfficeByUniqueIdService, getAllCheckoutSessionsByOfficeIdService: GetAllCheckoutSessionsByOfficeIdService, getAllCheckoutSessionItemsByCheckoutSessionIdService: GetAllCheckoutSessionItemsByCheckoutSessionIdService, handleUseCaseExceptionService: HandleUseCaseExceptionService);
    exec(dtoIn: ListCheckoutSessionsDtoIn): Promise<ListCheckoutSessionsDtoOut>;
    private matchesSearch;
}
