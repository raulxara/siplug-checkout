import type { IPermissionsRepository } from '../../entities/permissions-repository.interface';
import { FindPermissionByUniqueIdDtoIn } from './dtos/find-permission-by-unique-id.dto-in';
import { FindPermissionByUniqueIdDtoOut } from './dtos/find-permission-by-unique-id.dto-out';
export declare class FindPermissionByUniqueIdService {
    private readonly repository;
    constructor(repository: IPermissionsRepository);
    exec(dtoIn: FindPermissionByUniqueIdDtoIn): Promise<FindPermissionByUniqueIdDtoOut>;
}
