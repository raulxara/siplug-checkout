import type { IPermissionsRepository } from '../../entities/permissions-repository.interface';
import { GetAllPermissionsByUniqueIdsDtoIn } from './dtos/get-all-permissions-by-unique-ids.dto-in';
import { GetAllPermissionsByUniqueIdsDtoOut } from './dtos/get-all-permissions-by-unique-ids.dto-out';
export declare class GetAllPermissionsByUniqueIdsService {
    private readonly repository;
    constructor(repository: IPermissionsRepository);
    exec(dtoIn: GetAllPermissionsByUniqueIdsDtoIn): Promise<GetAllPermissionsByUniqueIdsDtoOut>;
}
