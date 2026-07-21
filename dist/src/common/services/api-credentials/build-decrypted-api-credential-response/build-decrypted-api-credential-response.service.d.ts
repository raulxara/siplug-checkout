import { DecryptApiCredentialSecretService } from '../../crypto/decrypt-api-credential-secret/decrypt-api-credential-secret.service';
import type { ApiCredentialRow } from '../../../../modules/api-credentials/entities/api-credentials-repository.interface';
export declare class BuildDecryptedApiCredentialResponseService {
    private readonly decryptApiCredentialSecretService;
    private readonly secretKeys;
    constructor(decryptApiCredentialSecretService: DecryptApiCredentialSecretService);
    exec(apiCredential: ApiCredentialRow): Record<string, unknown>;
    private decryptToken;
    private decryptConfig;
    private toRecordOrNull;
    private extractString;
}
