import type { IPositionPermissionsRepository } from '../../entities/position-permissions-repository.interface';
import { GetAllPositionPermissionsByPositionIdsDtoIn } from './dtos/get-all-position-permissions-by-position-ids.dto-in';
import { GetAllPositionPermissionsByPositionIdsDtoOut } from './dtos/get-all-position-permissions-by-position-ids.dto-out';
export declare class GetAllPositionPermissionsByPositionIdsService {
    private readonly repository;
    constructor(repository: IPositionPermissionsRepository);
    exec(dtoIn: GetAllPositionPermissionsByPositionIdsDtoIn): Promise<GetAllPositionPermissionsByPositionIdsDtoOut>;
}
