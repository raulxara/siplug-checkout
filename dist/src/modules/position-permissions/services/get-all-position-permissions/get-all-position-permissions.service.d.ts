import type { IPositionPermissionsRepository } from '../../entities/position-permissions-repository.interface';
import { GetAllPositionPermissionsDtoIn } from './dtos/get-all-position-permissions.dto-in';
import { GetAllPositionPermissionsDtoOut } from './dtos/get-all-position-permissions.dto-out';
export declare class GetAllPositionPermissionsService {
    private readonly repository;
    constructor(repository: IPositionPermissionsRepository);
    exec(dtoIn: GetAllPositionPermissionsDtoIn): Promise<GetAllPositionPermissionsDtoOut>;
}
