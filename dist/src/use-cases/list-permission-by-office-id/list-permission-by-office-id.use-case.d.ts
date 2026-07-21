import { HandleUseCaseExceptionService } from '../../common/services/use-case-support/handle-use-case-exception.service';
import { ListPermissionsByOfficeIdService } from '../../modules/permissions/services/list-permissions-by-office-id/list-permissions-by-office-id.service';
import { ListPermissionByOfficeIdDtoIn } from './dtos/list-permission-by-office-id.dto-in';
import { ListPermissionByOfficeIdDtoOut } from './dtos/list-permission-by-office-id.dto-out';
export declare class ListPermissionByOfficeIdUseCase {
    private readonly listPermissionsByOfficeIdService;
    private readonly handleUseCaseExceptionService;
    constructor(listPermissionsByOfficeIdService: ListPermissionsByOfficeIdService, handleUseCaseExceptionService: HandleUseCaseExceptionService);
    exec(dtoIn: ListPermissionByOfficeIdDtoIn): Promise<ListPermissionByOfficeIdDtoOut>;
}
