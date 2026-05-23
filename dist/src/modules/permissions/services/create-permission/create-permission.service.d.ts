import type { IPermissionsRepository } from '../../entities/permissions-repository.interface';
import { CreatePermissionDtoIn } from './dtos/create-permission.dto-in';
import { CreatePermissionDtoOut } from './dtos/create-permission.dto-out';
export declare class CreatePermissionService {
    private readonly repository;
    constructor(repository: IPermissionsRepository);
    exec(dtoIn: CreatePermissionDtoIn): Promise<CreatePermissionDtoOut>;
}
