import { HandleUseCaseExceptionService } from '../../common/services/use-case-support/handle-use-case-exception.service';
import { FindPositionByUniqueIdService } from '../../modules/positions/services/find-position-by-unique-id/find-position-by-unique-id.service';
import { UpdatePositionByUniqueIdService } from '../../modules/positions/services/update-position-by-unique-id/update-position-by-unique-id.service';
import { UpdatePositionByUniqueIdDtoIn } from './dtos/update-position-by-unique-id.dto-in';
import { UpdatePositionByUniqueIdDtoOut } from './dtos/update-position-by-unique-id.dto-out';
export declare class UpdatePositionByUniqueIdUseCase {
    private readonly findPositionByUniqueIdService;
    private readonly updatePositionByUniqueIdService;
    private readonly handleUseCaseExceptionService;
    constructor(findPositionByUniqueIdService: FindPositionByUniqueIdService, updatePositionByUniqueIdService: UpdatePositionByUniqueIdService, handleUseCaseExceptionService: HandleUseCaseExceptionService);
    exec(dtoIn: UpdatePositionByUniqueIdDtoIn): Promise<UpdatePositionByUniqueIdDtoOut>;
    private buildUpdateData;
    private buildChangesHistory;
    private normalizeChangesHistory;
    private nowAsSqlDateTime;
    private pad;
}
