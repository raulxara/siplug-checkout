import { HandleUseCaseExceptionService } from '../../common/services/use-case-support/handle-use-case-exception.service';
import { FindOfficeByUniqueIdService } from '../../modules/offices/services/find-office-by-unique-id/find-office-by-unique-id.service';
import { GetAllCheckoutSessionsByOfficeIdService } from '../../modules/checkout-sessions/services/get-all-checkout-sessions-by-office-id/get-all-checkout-sessions-by-office-id.service';
import { ResolveActorAuthorizationService } from '../../modules/security/services/resolve-actor-authorization/resolve-actor-authorization.service';
import { ListCheckoutSessionsByOfficeIdDtoIn } from './dtos/list-checkout-sessions-by-office-id.dto-in';
import { ListCheckoutSessionsByOfficeIdDtoOut } from './dtos/list-checkout-sessions-by-office-id.dto-out';
export declare class ListCheckoutSessionsByOfficeIdUseCase {
    private readonly resolveActorAuthorizationService;
    private readonly getAllCheckoutSessionsByOfficeIdService;
    private readonly findOfficeByUniqueIdService;
    private readonly handleUseCaseExceptionService;
    constructor(resolveActorAuthorizationService: ResolveActorAuthorizationService, getAllCheckoutSessionsByOfficeIdService: GetAllCheckoutSessionsByOfficeIdService, findOfficeByUniqueIdService: FindOfficeByUniqueIdService, handleUseCaseExceptionService: HandleUseCaseExceptionService);
    exec(dtoIn: ListCheckoutSessionsByOfficeIdDtoIn): Promise<ListCheckoutSessionsByOfficeIdDtoOut>;
}
