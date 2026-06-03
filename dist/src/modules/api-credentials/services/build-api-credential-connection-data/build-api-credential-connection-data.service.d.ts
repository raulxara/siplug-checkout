import { DecryptApiCredentialSecretService } from '../../../../common/services/crypto/decrypt-api-credential-secret/decrypt-api-credential-secret.service';
import { FindActiveApiCredentialBySlugService } from '../find-active-api-credential-by-slug/find-active-api-credential-by-slug.service';
import { BuildApiCredentialConnectionDataDtoIn } from './dtos/build-api-credential-connection-data.dto-in';
import { BuildApiCredentialConnectionDataDtoOut } from './dtos/build-api-credential-connection-data.dto-out';
export declare class BuildApiCredentialConnectionDataService {
    private readonly findActiveApiCredentialBySlugService;
    private readonly decryptApiCredentialSecretService;
    constructor(findActiveApiCredentialBySlugService: FindActiveApiCredentialBySlugService, decryptApiCredentialSecretService: DecryptApiCredentialSecretService);
    exec(dtoIn: BuildApiCredentialConnectionDataDtoIn): Promise<BuildApiCredentialConnectionDataDtoOut>;
    private parseHeaders;
    private parseExpectedStatusCodes;
}
