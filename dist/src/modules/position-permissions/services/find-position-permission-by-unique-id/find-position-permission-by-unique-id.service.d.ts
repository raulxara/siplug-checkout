import type { IPositionPermissionsRepository } from '../../entities/position-permissions-repository.interface';
import { FindPositionPermissionByUniqueIdDtoIn } from './dtos/find-position-permission-by-unique-id.dto-in';
import { FindPositionPermissionByUniqueIdDtoOut } from './dtos/find-position-permission-by-unique-id.dto-out';
export declare class FindPositionPermissionByUniqueIdService {
    private readonly repository;
    constructor(repository: IPositionPermissionsRepository);
    exec(dtoIn: FindPositionPermissionByUniqueIdDtoIn): Promise<FindPositionPermissionByUniqueIdDtoOut>;
}
