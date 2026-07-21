import { EncryptApiCredentialSecretDtoIn } from './dtos/encrypt-api-credential-secret.dto-in';
import { EncryptApiCredentialSecretDtoOut } from './dtos/encrypt-api-credential-secret.dto-out';
export declare class EncryptApiCredentialSecretService {
    exec(dtoIn: EncryptApiCredentialSecretDtoIn): EncryptApiCredentialSecretDtoOut;
    private encryptArrayRecursively;
    private encryptValue;
}
