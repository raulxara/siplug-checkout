import type { IPermissionsRepository } from '../../entities/permissions-repository.interface';
import { GetAllPermissionsByOfficeIdDtoIn } from './dtos/get-all-permissions-by-office-id.dto-in';
import { GetAllPermissionsByOfficeIdDtoOut } from './dtos/get-all-permissions-by-office-id.dto-out';
export declare class GetAllPermissionsByOfficeIdService {
    private readonly repository;
    constructor(repository: IPermissionsRepository);
    exec(dtoIn: GetAllPermissionsByOfficeIdDtoIn): Promise<GetAllPermissionsByOfficeIdDtoOut>;
}
