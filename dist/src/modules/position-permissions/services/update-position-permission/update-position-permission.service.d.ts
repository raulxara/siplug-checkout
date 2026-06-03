import { BuildChangesHistoryService } from '../../../../common/services/changes-history/build-changes-history.service';
import type { IPositionPermissionsRepository } from '../../entities/position-permissions-repository.interface';
import { UpdatePositionPermissionDtoIn } from './dtos/update-position-permission.dto-in';
import { UpdatePositionPermissionDtoOut } from './dtos/update-position-permission.dto-out';
export declare class UpdatePositionPermissionService {
    private readonly repository;
    private readonly buildChangesHistoryService;
    constructor(repository: IPositionPermissionsRepository, buildChangesHistoryService: BuildChangesHistoryService);
    exec(dtoIn: UpdatePositionPermissionDtoIn): Promise<UpdatePositionPermissionDtoOut>;
    private removeNullValues;
    private buildOldData;
}
