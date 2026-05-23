import type { IPositionPermissionsRepository } from '../../entities/position-permissions-repository.interface';
import { FindPositionPermissionByPositionAndPermissionDtoIn } from './dtos/find-position-permission-by-position-and-permission.dto-in';
import { FindPositionPermissionByPositionAndPermissionDtoOut } from './dtos/find-position-permission-by-position-and-permission.dto-out';
export declare class FindPositionPermissionByPositionAndPermissionService {
    private readonly repository;
    constructor(repository: IPositionPermissionsRepository);
    exec(dtoIn: FindPositionPermissionByPositionAndPermissionDtoIn): Promise<FindPositionPermissionByPositionAndPermissionDtoOut>;
}
