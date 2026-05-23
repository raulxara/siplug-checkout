import { HandleUseCaseExceptionService } from '../../common/services/use-case-support/handle-use-case-exception.service';
import { CreatePermissionService } from '../../modules/permissions/services/create-permission/create-permission.service';
import { ValidatePermissionSlugUniquenessService } from '../../modules/permissions/services/validate-permission-slug-uniqueness/validate-permission-slug-uniqueness.service';
import { ResolveActorAuthorizationService } from '../../modules/security/services/resolve-actor-authorization/resolve-actor-authorization.service';
import { RegisterPermissionDtoIn } from './dtos/register-permission.dto-in';
import { RegisterPermissionDtoOut } from './dtos/register-permission.dto-out';
export declare class RegisterPermissionUseCase {
    private readonly resolveActorAuthorizationService;
    private readonly validatePermissionSlugUniquenessService;
    private readonly createPermissionService;
    private readonly handleUseCaseExceptionService;
    constructor(resolveActorAuthorizationService: ResolveActorAuthorizationService, validatePermissionSlugUniquenessService: ValidatePermissionSlugUniquenessService, createPermissionService: CreatePermissionService, handleUseCaseExceptionService: HandleUseCaseExceptionService);
    exec(dtoIn: RegisterPermissionDtoIn): Promise<RegisterPermissionDtoOut>;
}
