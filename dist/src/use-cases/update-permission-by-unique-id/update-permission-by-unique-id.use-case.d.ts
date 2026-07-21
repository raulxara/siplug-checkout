import { HandleUseCaseExceptionService } from '../../common/services/use-case-support/handle-use-case-exception.service';
import { FindPermissionByUniqueIdService } from '../../modules/permissions/services/find-permission-by-unique-id/find-permission-by-unique-id.service';
import { UpdatePermissionService } from '../../modules/permissions/services/update-permission/update-permission.service';
import { UpdatePermissionByUniqueIdDtoIn } from './dtos/update-permission-by-unique-id.dto-in';
import { UpdatePermissionByUniqueIdDtoOut } from './dtos/update-permission-by-unique-id.dto-out';
export declare class UpdatePermissionByUniqueIdUseCase {
    private readonly findPermissionByUniqueIdService;
    private readonly updatePermissionService;
    private readonly handleUseCaseExceptionService;
    constructor(findPermissionByUniqueIdService: FindPermissionByUniqueIdService, updatePermissionService: UpdatePermissionService, handleUseCaseExceptionService: HandleUseCaseExceptionService);
    exec(dtoIn: UpdatePermissionByUniqueIdDtoIn): Promise<UpdatePermissionByUniqueIdDtoOut>;
}
