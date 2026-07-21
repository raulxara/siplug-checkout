import type { IPositionPermissionsRepository } from '../../entities/position-permissions-repository.interface';
import { CreatePositionPermissionDtoIn } from './dtos/create-position-permission.dto-in';
import { CreatePositionPermissionDtoOut } from './dtos/create-position-permission.dto-out';
export declare class CreatePositionPermissionService {
    private readonly repository;
    constructor(repository: IPositionPermissionsRepository);
    exec(dtoIn: CreatePositionPermissionDtoIn): Promise<CreatePositionPermissionDtoOut>;
}
