import type { IPermissionsRepository } from '../../entities/permissions-repository.interface';
import { FindPermissionBySlugDtoIn } from './dtos/find-permission-by-slug.dto-in';
import { FindPermissionBySlugDtoOut } from './dtos/find-permission-by-slug.dto-out';
export declare class FindPermissionBySlugService {
    private readonly repository;
    constructor(repository: IPermissionsRepository);
    exec(dtoIn: FindPermissionBySlugDtoIn): Promise<FindPermissionBySlugDtoOut>;
}
