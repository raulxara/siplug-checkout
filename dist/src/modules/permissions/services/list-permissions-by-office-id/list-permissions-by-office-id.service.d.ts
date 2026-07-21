import type { IPermissionsRepository } from '../../entities/permissions-repository.interface';
import { ListPermissionsByOfficeIdDtoIn } from './dtos/list-permissions-by-office-id.dto-in';
import { ListPermissionsByOfficeIdDtoOut } from './dtos/list-permissions-by-office-id.dto-out';
export declare class ListPermissionsByOfficeIdService {
    private readonly permissionsRepository;
    constructor(permissionsRepository: IPermissionsRepository);
    exec(dtoIn: ListPermissionsByOfficeIdDtoIn): Promise<ListPermissionsByOfficeIdDtoOut>;
}
