import { HandleUseCaseExceptionService } from '../../common/services/use-case-support/handle-use-case-exception.service';
import { FindPermissionByUniqueIdService } from '../../modules/permissions/services/find-permission-by-unique-id/find-permission-by-unique-id.service';
import { GetPermissionByUniqueIdDtoIn } from './dtos/get-permission-by-unique-id.dto-in';
import { GetPermissionByUniqueIdDtoOut } from './dtos/get-permission-by-unique-id.dto-out';
export declare class GetPermissionByUniqueIdUseCase {
    private readonly findPermissionByUniqueIdService;
    private readonly handleUseCaseExceptionService;
    constructor(findPermissionByUniqueIdService: FindPermissionByUniqueIdService, handleUseCaseExceptionService: HandleUseCaseExceptionService);
    exec(dtoIn: GetPermissionByUniqueIdDtoIn): Promise<GetPermissionByUniqueIdDtoOut>;
}
