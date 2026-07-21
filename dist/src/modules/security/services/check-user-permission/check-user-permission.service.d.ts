import { GetAllPermissionsByUniqueIdsService } from '../../../permissions/services/get-all-permissions-by-unique-ids/get-all-permissions-by-unique-ids.service';
import { GetAllPositionPermissionsByPositionIdsService } from '../../../position-permissions/services/get-all-position-permissions-by-position-ids/get-all-position-permissions-by-position-ids.service';
import { GetAllPositionsByUniqueIdsService } from '../../../positions/services/get-all-positions-by-unique-ids/get-all-positions-by-unique-ids.service';
import { GetAllUserPositionsByUserCustomerIdService } from '../../../user-positions/services/get-all-user-positions-by-user-customer-id/get-all-user-positions-by-user-customer-id.service';
import { CheckUserPermissionDtoIn } from './dtos/check-user-permission.dto-in';
import { CheckUserPermissionDtoOut } from './dtos/check-user-permission.dto-out';
export declare class CheckUserPermissionService {
    private readonly getAllUserPositionsByUserCustomerIdService;
    private readonly getAllPositionsByUniqueIdsService;
    private readonly getAllPositionPermissionsByPositionIdsService;
    private readonly getAllPermissionsByUniqueIdsService;
    constructor(getAllUserPositionsByUserCustomerIdService: GetAllUserPositionsByUserCustomerIdService, getAllPositionsByUniqueIdsService: GetAllPositionsByUniqueIdsService, getAllPositionPermissionsByPositionIdsService: GetAllPositionPermissionsByPositionIdsService, getAllPermissionsByUniqueIdsService: GetAllPermissionsByUniqueIdsService);
    exec(dtoIn: CheckUserPermissionDtoIn): Promise<CheckUserPermissionDtoOut>;
}
