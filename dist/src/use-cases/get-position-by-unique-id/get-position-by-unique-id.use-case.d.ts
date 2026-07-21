import { HandleUseCaseExceptionService } from '../../common/services/use-case-support/handle-use-case-exception.service';
import { FindPositionByUniqueIdService } from '../../modules/positions/services/find-position-by-unique-id/find-position-by-unique-id.service';
import { GetPositionByUniqueIdDtoIn } from './dtos/get-position-by-unique-id.dto-in';
import { GetPositionByUniqueIdDtoOut } from './dtos/get-position-by-unique-id.dto-out';
export declare class GetPositionByUniqueIdUseCase {
    private readonly findPositionByUniqueIdService;
    private readonly handleUseCaseExceptionService;
    constructor(findPositionByUniqueIdService: FindPositionByUniqueIdService, handleUseCaseExceptionService: HandleUseCaseExceptionService);
    exec(dtoIn: GetPositionByUniqueIdDtoIn): Promise<GetPositionByUniqueIdDtoOut>;
}
