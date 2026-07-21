import { HandleUseCaseExceptionService } from '../../common/services/use-case-support/handle-use-case-exception.service';
import { GetAllClientsByOfficeIdService } from '../../modules/clients/services/get-all-clients-by-office-id/get-all-clients-by-office-id.service';
import { FindOfficeByUniqueIdService } from '../../modules/offices/services/find-office-by-unique-id/find-office-by-unique-id.service';
import { GetAllPositionsByUniqueIdsService } from '../../modules/positions/services/get-all-positions-by-unique-ids/get-all-positions-by-unique-ids.service';
import { FindProfileByUniqueIdService } from '../../modules/profiles/services/find-profile-by-unique-id/find-profile-by-unique-id.service';
import { ResolveActorAuthorizationService } from '../../modules/security/services/resolve-actor-authorization/resolve-actor-authorization.service';
import { GetAllUserCustomersByClientIdsService } from '../../modules/user-customers/services/get-all-user-customers-by-client-ids/get-all-user-customers-by-client-ids.service';
import { GetAllUserPositionsByUserCustomerIdService } from '../../modules/user-positions/services/get-all-user-positions-by-user-customer-id/get-all-user-positions-by-user-customer-id.service';
import { GetAllUsersByOfficeIdDtoIn } from './dtos/get-all-users-by-office-id.dto-in';
import { GetAllUsersByOfficeIdDtoOut } from './dtos/get-all-users-by-office-id.dto-out';
export declare class GetAllUsersByOfficeIdUseCase {
    private readonly resolveActorAuthorizationService;
    private readonly findOfficeByUniqueIdService;
    private readonly getAllClientsByOfficeIdService;
    private readonly getAllUserCustomersByClientIdsService;
    private readonly findProfileByUniqueIdService;
    private readonly getAllUserPositionsByUserCustomerIdService;
    private readonly getAllPositionsByUniqueIdsService;
    private readonly handleUseCaseExceptionService;
    constructor(resolveActorAuthorizationService: ResolveActorAuthorizationService, findOfficeByUniqueIdService: FindOfficeByUniqueIdService, getAllClientsByOfficeIdService: GetAllClientsByOfficeIdService, getAllUserCustomersByClientIdsService: GetAllUserCustomersByClientIdsService, findProfileByUniqueIdService: FindProfileByUniqueIdService, getAllUserPositionsByUserCustomerIdService: GetAllUserPositionsByUserCustomerIdService, getAllPositionsByUniqueIdsService: GetAllPositionsByUniqueIdsService, handleUseCaseExceptionService: HandleUseCaseExceptionService);
    exec(dtoIn: GetAllUsersByOfficeIdDtoIn): Promise<GetAllUsersByOfficeIdDtoOut>;
    private matchesSearch;
    private hideUserCustomerToken;
}
