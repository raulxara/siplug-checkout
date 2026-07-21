import { HandleUseCaseExceptionService } from '../../common/services/use-case-support/handle-use-case-exception.service';
import { FindCheckoutSessionByUniqueIdService } from '../../modules/checkout-sessions/services/find-checkout-session-by-unique-id/find-checkout-session-by-unique-id.service';
import { GetAllCheckoutSessionItemsByCheckoutSessionIdService } from '../../modules/checkout-sessions/services/get-all-checkout-session-items-by-checkout-session-id/get-all-checkout-session-items-by-checkout-session-id.service';
import { FindOfficeByUniqueIdService } from '../../modules/offices/services/find-office-by-unique-id/find-office-by-unique-id.service';
import { ResolveActorAuthorizationService } from '../../modules/security/services/resolve-actor-authorization/resolve-actor-authorization.service';
import { GetCheckoutSessionByUniqueIdDtoIn } from './dtos/get-checkout-session-by-unique-id.dto-in';
import { GetCheckoutSessionByUniqueIdDtoOut } from './dtos/get-checkout-session-by-unique-id.dto-out';
export declare class GetCheckoutSessionByUniqueIdUseCase {
    private readonly resolveActorAuthorizationService;
    private readonly findCheckoutSessionByUniqueIdService;
    private readonly getAllCheckoutSessionItemsByCheckoutSessionIdService;
    private readonly findOfficeByUniqueIdService;
    private readonly handleUseCaseExceptionService;
    constructor(resolveActorAuthorizationService: ResolveActorAuthorizationService, findCheckoutSessionByUniqueIdService: FindCheckoutSessionByUniqueIdService, getAllCheckoutSessionItemsByCheckoutSessionIdService: GetAllCheckoutSessionItemsByCheckoutSessionIdService, findOfficeByUniqueIdService: FindOfficeByUniqueIdService, handleUseCaseExceptionService: HandleUseCaseExceptionService);
    exec(dtoIn: GetCheckoutSessionByUniqueIdDtoIn): Promise<GetCheckoutSessionByUniqueIdDtoOut>;
}
