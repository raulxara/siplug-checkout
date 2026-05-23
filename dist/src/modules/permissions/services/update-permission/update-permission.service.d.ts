import { BuildChangesHistoryService } from '../../../../common/services/changes-history/build-changes-history.service';
import type { IPermissionsRepository } from '../../entities/permissions-repository.interface';
import { UpdatePermissionDtoIn } from './dtos/update-permission.dto-in';
import { UpdatePermissionDtoOut } from './dtos/update-permission.dto-out';
export declare class UpdatePermissionService {
    private readonly repository;
    private readonly buildChangesHistoryService;
    constructor(repository: IPermissionsRepository, buildChangesHistoryService: BuildChangesHistoryService);
    exec(dtoIn: UpdatePermissionDtoIn): Promise<UpdatePermissionDtoOut>;
    private removeNullValues;
    private buildOldData;
}
