import { EncryptApiCredentialSecretService } from '../../common/services/crypto/encrypt-api-credential-secret/encrypt-api-credential-secret.service';
import { HandleUseCaseExceptionService } from '../../common/services/use-case-support/handle-use-case-exception.service';
import { FindApiCredentialByUniqueIdService } from '../../modules/api-credentials/services/find-api-credential-by-unique-id/find-api-credential-by-unique-id.service';
import { NormalizeApiCredentialConfigService } from '../../modules/api-credentials/services/normalize-api-credential-config/normalize-api-credential-config.service';
import { UpdateApiCredentialService } from '../../modules/api-credentials/services/update-api-credential/update-api-credential.service';
import { ValidateApiCredentialSlugUniquenessService } from '../../modules/api-credentials/services/validate-api-credential-slug-uniqueness/validate-api-credential-slug-uniqueness.service';
import { FindClientByUniqueIdService } from '../../modules/clients/services/find-client-by-unique-id/find-client-by-unique-id.service';
import { FindOfficeByUniqueIdService } from '../../modules/offices/services/find-office-by-unique-id/find-office-by-unique-id.service';
import { ResolveActorAuthorizationService } from '../../modules/security/services/resolve-actor-authorization/resolve-actor-authorization.service';
import { UpdateApiCredentialDtoIn } from './dtos/update-api-credential.dto-in';
import { UpdateApiCredentialDtoOut } from './dtos/update-api-credential.dto-out';
export declare class UpdateApiCredentialUseCase {
    private readonly resolveActorAuthorizationService;
    private readonly findApiCredentialByUniqueIdService;
    private readonly findOfficeByUniqueIdService;
    private readonly findClientByUniqueIdService;
    private readonly validateApiCredentialSlugUniquenessService;
    private readonly normalizeApiCredentialConfigService;
    private readonly encryptApiCredentialSecretService;
    private readonly updateApiCredentialService;
    private readonly handleUseCaseExceptionService;
    constructor(resolveActorAuthorizationService: ResolveActorAuthorizationService, findApiCredentialByUniqueIdService: FindApiCredentialByUniqueIdService, findOfficeByUniqueIdService: FindOfficeByUniqueIdService, findClientByUniqueIdService: FindClientByUniqueIdService, validateApiCredentialSlugUniquenessService: ValidateApiCredentialSlugUniquenessService, normalizeApiCredentialConfigService: NormalizeApiCredentialConfigService, encryptApiCredentialSecretService: EncryptApiCredentialSecretService, updateApiCredentialService: UpdateApiCredentialService, handleUseCaseExceptionService: HandleUseCaseExceptionService);
    exec(dtoIn: UpdateApiCredentialDtoIn): Promise<UpdateApiCredentialDtoOut>;
    private encryptProviderTokenIfNeeded;
    private encryptConfigIfNeeded;
    private hideSensitiveToken;
}
