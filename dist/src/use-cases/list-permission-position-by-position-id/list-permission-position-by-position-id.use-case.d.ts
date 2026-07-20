import { HandleUseCaseExceptionService } from '../../common/services/use-case-support/handle-use-case-exception.service';
import { GetAllPositionPermissionsByPositionIdsService } from '../../modules/position-permissions/services/get-all-position-permissions-by-position-ids/get-all-position-permissions-by-position-ids.service';
import { FindPositionByUniqueIdService } from '../../modules/positions/services/find-position-by-unique-id/find-position-by-unique-id.service';
import { ListPermissionPositionByPositionIdDtoIn } from './dtos/list-permission-position-by-position-id.dto-in';
import { ListPermissionPositionByPositionIdDtoOut } from './dtos/list-permission-position-by-position-id.dto-out';
export declare class ListPermissionPositionByPositionIdUseCase {
    private readonly findPositionByUniqueIdService;
    private readonly getAllPositionPermissionsByPositionIdsService;
    private readonly handleUseCaseExceptionService;
    constructor(findPositionByUniqueIdService: FindPositionByUniqueIdService, getAllPositionPermissionsByPositionIdsService: GetAllPositionPermissionsByPositionIdsService, handleUseCaseExceptionService: HandleUseCaseExceptionService);
    exec(dtoIn: ListPermissionPositionByPositionIdDtoIn): Promise<ListPermissionPositionByPositionIdDtoOut>;
}
