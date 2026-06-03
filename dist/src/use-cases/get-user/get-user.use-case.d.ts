import { HandleUseCaseExceptionService } from '../../common/services/use-case-support/handle-use-case-exception.service';
import { FindClientByUniqueIdService } from '../../modules/clients/services/find-client-by-unique-id/find-client-by-unique-id.service';
import { GetAllPositionsByUniqueIdsService } from '../../modules/positions/services/get-all-positions-by-unique-ids/get-all-positions-by-unique-ids.service';
import { FindProfileByUniqueIdService } from '../../modules/profiles/services/find-profile-by-unique-id/find-profile-by-unique-id.service';
import { ResolveActorAuthorizationService } from '../../modules/security/services/resolve-actor-authorization/resolve-actor-authorization.service';
import { GetAllUserAccessCodesByUserCustomerIdService } from '../../modules/user-access-codes/services/get-all-user-access-codes-by-user-customer-id/get-all-user-access-codes-by-user-customer-id.service';
import { FindUserCustomerByUniqueIdService } from '../../modules/user-customers/services/find-user-customer-by-unique-id/find-user-customer-by-unique-id.service';
import { GetAllUserPositionsByUserCustomerIdService } from '../../modules/user-positions/services/get-all-user-positions-by-user-customer-id/get-all-user-positions-by-user-customer-id.service';
import { GetUserDtoIn } from './dtos/get-user.dto-in';
import { GetUserDtoOut } from './dtos/get-user.dto-out';
export declare class GetUserUseCase {
    private readonly resolveActorAuthorizationService;
    private readonly findUserCustomerByUniqueIdService;
    private readonly findClientByUniqueIdService;
    private readonly findProfileByUniqueIdService;
    private readonly getAllUserPositionsByUserCustomerIdService;
    private readonly getAllPositionsByUniqueIdsService;
    private readonly getAllUserAccessCodesByUserCustomerIdService;
    private readonly handleUseCaseExceptionService;
    constructor(resolveActorAuthorizationService: ResolveActorAuthorizationService, findUserCustomerByUniqueIdService: FindUserCustomerByUniqueIdService, findClientByUniqueIdService: FindClientByUniqueIdService, findProfileByUniqueIdService: FindProfileByUniqueIdService, getAllUserPositionsByUserCustomerIdService: GetAllUserPositionsByUserCustomerIdService, getAllPositionsByUniqueIdsService: GetAllPositionsByUniqueIdsService, getAllUserAccessCodesByUserCustomerIdService: GetAllUserAccessCodesByUserCustomerIdService, handleUseCaseExceptionService: HandleUseCaseExceptionService);
    exec(dtoIn: GetUserDtoIn): Promise<GetUserDtoOut>;
    private hideUserCustomerToken;
    private hideAccessCode;
}
