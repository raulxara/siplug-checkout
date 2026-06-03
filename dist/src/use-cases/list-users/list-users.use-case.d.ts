import { HandleUseCaseExceptionService } from '../../common/services/use-case-support/handle-use-case-exception.service';
import { FindClientByUniqueIdService } from '../../modules/clients/services/find-client-by-unique-id/find-client-by-unique-id.service';
import { FindOfficeByUniqueIdService } from '../../modules/offices/services/find-office-by-unique-id/find-office-by-unique-id.service';
import { GetAllPositionsByUniqueIdsService } from '../../modules/positions/services/get-all-positions-by-unique-ids/get-all-positions-by-unique-ids.service';
import { FindProfileByUniqueIdService } from '../../modules/profiles/services/find-profile-by-unique-id/find-profile-by-unique-id.service';
import { ResolveActorAuthorizationService } from '../../modules/security/services/resolve-actor-authorization/resolve-actor-authorization.service';
import { GetAllUserCustomersService } from '../../modules/user-customers/services/get-all-user-customers/get-all-user-customers.service';
import { GetAllUserPositionsByUserCustomerIdService } from '../../modules/user-positions/services/get-all-user-positions-by-user-customer-id/get-all-user-positions-by-user-customer-id.service';
import { ListUsersDtoIn } from './dtos/list-users.dto-in';
import { ListUsersDtoOut } from './dtos/list-users.dto-out';
export declare class ListUsersUseCase {
    private readonly resolveActorAuthorizationService;
    private readonly findOfficeByUniqueIdService;
    private readonly getAllUserCustomersService;
    private readonly findClientByUniqueIdService;
    private readonly findProfileByUniqueIdService;
    private readonly getAllUserPositionsByUserCustomerIdService;
    private readonly getAllPositionsByUniqueIdsService;
    private readonly handleUseCaseExceptionService;
    constructor(resolveActorAuthorizationService: ResolveActorAuthorizationService, findOfficeByUniqueIdService: FindOfficeByUniqueIdService, getAllUserCustomersService: GetAllUserCustomersService, findClientByUniqueIdService: FindClientByUniqueIdService, findProfileByUniqueIdService: FindProfileByUniqueIdService, getAllUserPositionsByUserCustomerIdService: GetAllUserPositionsByUserCustomerIdService, getAllPositionsByUniqueIdsService: GetAllPositionsByUniqueIdsService, handleUseCaseExceptionService: HandleUseCaseExceptionService);
    exec(dtoIn: ListUsersDtoIn): Promise<ListUsersDtoOut>;
    private matchesSearch;
    private hideUserCustomerToken;
}
