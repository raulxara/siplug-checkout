import { EncryptApiCredentialSecretService } from '../../common/services/crypto/encrypt-api-credential-secret/encrypt-api-credential-secret.service';
import { HandleUseCaseExceptionService } from '../../common/services/use-case-support/handle-use-case-exception.service';
import { CreateApiCredentialService } from '../../modules/api-credentials/services/create-api-credential/create-api-credential.service';
import { NormalizeApiCredentialConfigService } from '../../modules/api-credentials/services/normalize-api-credential-config/normalize-api-credential-config.service';
import { ValidateApiCredentialSlugUniquenessService } from '../../modules/api-credentials/services/validate-api-credential-slug-uniqueness/validate-api-credential-slug-uniqueness.service';
import { FindClientByUniqueIdService } from '../../modules/clients/services/find-client-by-unique-id/find-client-by-unique-id.service';
import { FindOfficeByUniqueIdService } from '../../modules/offices/services/find-office-by-unique-id/find-office-by-unique-id.service';
import { ResolveActorAuthorizationService } from '../../modules/security/services/resolve-actor-authorization/resolve-actor-authorization.service';
import { RegisterApiCredentialDtoIn } from './dtos/register-api-credential.dto-in';
import { RegisterApiCredentialDtoOut } from './dtos/register-api-credential.dto-out';
export declare class RegisterApiCredentialUseCase {
    private readonly resolveActorAuthorizationService;
    private readonly findOfficeByUniqueIdService;
    private readonly findClientByUniqueIdService;
    private readonly validateApiCredentialSlugUniquenessService;
    private readonly normalizeApiCredentialConfigService;
    private readonly encryptApiCredentialSecretService;
    private readonly createApiCredentialService;
    private readonly handleUseCaseExceptionService;
    constructor(resolveActorAuthorizationService: ResolveActorAuthorizationService, findOfficeByUniqueIdService: FindOfficeByUniqueIdService, findClientByUniqueIdService: FindClientByUniqueIdService, validateApiCredentialSlugUniquenessService: ValidateApiCredentialSlugUniquenessService, normalizeApiCredentialConfigService: NormalizeApiCredentialConfigService, encryptApiCredentialSecretService: EncryptApiCredentialSecretService, createApiCredentialService: CreateApiCredentialService, handleUseCaseExceptionService: HandleUseCaseExceptionService);
    exec(dtoIn: RegisterApiCredentialDtoIn): Promise<RegisterApiCredentialDtoOut>;
}
