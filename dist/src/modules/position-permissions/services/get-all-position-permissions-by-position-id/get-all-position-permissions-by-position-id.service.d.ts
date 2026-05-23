import type { IPositionPermissionsRepository } from '../../entities/position-permissions-repository.interface';
import { GetAllPositionPermissionsByPositionIdDtoIn } from './dtos/get-all-position-permissions-by-position-id.dto-in';
import { GetAllPositionPermissionsByPositionIdDtoOut } from './dtos/get-all-position-permissions-by-position-id.dto-out';
export declare class GetAllPositionPermissionsByPositionIdService {
    private readonly repository;
    constructor(repository: IPositionPermissionsRepository);
    exec(dtoIn: GetAllPositionPermissionsByPositionIdDtoIn): Promise<GetAllPositionPermissionsByPositionIdDtoOut>;
}
