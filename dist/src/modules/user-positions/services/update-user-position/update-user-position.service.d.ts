import { BuildChangesHistoryService } from '../../../../common/services/changes-history/build-changes-history.service';
import type { IUserPositionsRepository } from '../../entities/user-positions-repository.interface';
import { UpdateUserPositionDtoIn } from './dtos/update-user-position.dto-in';
import { UpdateUserPositionDtoOut } from './dtos/update-user-position.dto-out';
export declare class UpdateUserPositionService {
    private readonly repository;
    private readonly buildChangesHistoryService;
    constructor(repository: IUserPositionsRepository, buildChangesHistoryService: BuildChangesHistoryService);
    exec(dtoIn: UpdateUserPositionDtoIn): Promise<UpdateUserPositionDtoOut>;
    private removeNullValues;
    private buildOldData;
}
