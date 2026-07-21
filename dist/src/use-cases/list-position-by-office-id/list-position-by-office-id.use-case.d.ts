import { HandleUseCaseExceptionService } from '../../common/services/use-case-support/handle-use-case-exception.service';
import { ListPositionsByOfficeIdService } from '../../modules/positions/services/list-positions-by-office-id/list-positions-by-office-id.service';
import { ListPositionByOfficeIdDtoIn } from './dtos/list-position-by-office-id.dto-in';
import { ListPositionByOfficeIdDtoOut } from './dtos/list-position-by-office-id.dto-out';
export declare class ListPositionByOfficeIdUseCase {
    private readonly listPositionsByOfficeIdService;
    private readonly handleUseCaseExceptionService;
    constructor(listPositionsByOfficeIdService: ListPositionsByOfficeIdService, handleUseCaseExceptionService: HandleUseCaseExceptionService);
    exec(dtoIn: ListPositionByOfficeIdDtoIn): Promise<ListPositionByOfficeIdDtoOut>;
}
