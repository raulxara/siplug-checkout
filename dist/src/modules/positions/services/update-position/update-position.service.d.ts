import { BuildChangesHistoryService } from '../../../../common/services/changes-history/build-changes-history.service';
import type { IPositionsRepository } from '../../entities/positions-repository.interface';
import { UpdatePositionDtoIn } from './dtos/update-position.dto-in';
import { UpdatePositionDtoOut } from './dtos/update-position.dto-out';
export declare class UpdatePositionService {
    private readonly repository;
    private readonly buildChangesHistoryService;
    constructor(repository: IPositionsRepository, buildChangesHistoryService: BuildChangesHistoryService);
    exec(dtoIn: UpdatePositionDtoIn): Promise<UpdatePositionDtoOut>;
    private removeNullValues;
    private buildOldData;
}
