import { DecryptApiCredentialSecretDtoIn } from './dtos/decrypt-api-credential-secret.dto-in';
import { DecryptApiCredentialSecretDtoOut } from './dtos/decrypt-api-credential-secret.dto-out';
export declare class DecryptApiCredentialSecretService {
    exec(dtoIn: DecryptApiCredentialSecretDtoIn): DecryptApiCredentialSecretDtoOut;
    private decryptArrayRecursively;
    private decryptValue;
}
