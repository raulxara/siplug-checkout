import { HandleUseCaseExceptionService } from '../../common/services/use-case-support/handle-use-case-exception.service';
import { FindOfficeByUniqueIdService } from '../../modules/offices/services/find-office-by-unique-id/find-office-by-unique-id.service';
import { CreatePositionService } from '../../modules/positions/services/create-position/create-position.service';
import { ValidatePositionSlugUniquenessService } from '../../modules/positions/services/validate-position-slug-uniqueness/validate-position-slug-uniqueness.service';
import { ResolveActorAuthorizationService } from '../../modules/security/services/resolve-actor-authorization/resolve-actor-authorization.service';
import { RegisterPositionDtoIn } from './dtos/register-position.dto-in';
import { RegisterPositionDtoOut } from './dtos/register-position.dto-out';
export declare class RegisterPositionUseCase {
    private readonly resolveActorAuthorizationService;
    private readonly findOfficeByUniqueIdService;
    private readonly validatePositionSlugUniquenessService;
    private readonly createPositionService;
    private readonly handleUseCaseExceptionService;
    constructor(resolveActorAuthorizationService: ResolveActorAuthorizationService, findOfficeByUniqueIdService: FindOfficeByUniqueIdService, validatePositionSlugUniquenessService: ValidatePositionSlugUniquenessService, createPositionService: CreatePositionService, handleUseCaseExceptionService: HandleUseCaseExceptionService);
    exec(dtoIn: RegisterPositionDtoIn): Promise<RegisterPositionDtoOut>;
}
