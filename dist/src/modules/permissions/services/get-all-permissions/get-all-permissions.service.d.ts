import type { IPermissionsRepository } from '../../entities/permissions-repository.interface';
import { GetAllPermissionsDtoIn } from './dtos/get-all-permissions.dto-in';
import { GetAllPermissionsDtoOut } from './dtos/get-all-permissions.dto-out';
export declare class GetAllPermissionsService {
    private readonly repository;
    constructor(repository: IPermissionsRepository);
    exec(dtoIn: GetAllPermissionsDtoIn): Promise<GetAllPermissionsDtoOut>;
}
