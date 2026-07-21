import { HandleUseCaseExceptionService } from '../../common/services/use-case-support/handle-use-case-exception.service';
import { GetAllPermissionsByUniqueIdsService } from '../../modules/permissions/services/get-all-permissions-by-unique-ids/get-all-permissions-by-unique-ids.service';
import { CreatePositionPermissionService } from '../../modules/position-permissions/services/create-position-permission/create-position-permission.service';
import { GetAllPositionPermissionsByPositionIdService } from '../../modules/position-permissions/services/get-all-position-permissions-by-position-id/get-all-position-permissions-by-position-id.service';
import { UpdatePositionPermissionService } from '../../modules/position-permissions/services/update-position-permission/update-position-permission.service';
import { FindPositionByUniqueIdService } from '../../modules/positions/services/find-position-by-unique-id/find-position-by-unique-id.service';
import { ResolveActorAuthorizationService } from '../../modules/security/services/resolve-actor-authorization/resolve-actor-authorization.service';
import { SyncPositionPermissionsDtoIn } from './dtos/sync-position-permissions.dto-in';
import { SyncPositionPermissionsDtoOut } from './dtos/sync-position-permissions.dto-out';
export declare class SyncPositionPermissionsUseCase {
    private readonly resolveActorAuthorizationService;
    private readonly findPositionByUniqueIdService;
    private readonly getAllPermissionsByUniqueIdsService;
    private readonly getAllPositionPermissionsByPositionIdService;
    private readonly createPositionPermissionService;
    private readonly updatePositionPermissionService;
    private readonly handleUseCaseExceptionService;
    constructor(resolveActorAuthorizationService: ResolveActorAuthorizationService, findPositionByUniqueIdService: FindPositionByUniqueIdService, getAllPermissionsByUniqueIdsService: GetAllPermissionsByUniqueIdsService, getAllPositionPermissionsByPositionIdService: GetAllPositionPermissionsByPositionIdService, createPositionPermissionService: CreatePositionPermissionService, updatePositionPermissionService: UpdatePositionPermissionService, handleUseCaseExceptionService: HandleUseCaseExceptionService);
    exec(dtoIn: SyncPositionPermissionsDtoIn): Promise<SyncPositionPermissionsDtoOut>;
}
