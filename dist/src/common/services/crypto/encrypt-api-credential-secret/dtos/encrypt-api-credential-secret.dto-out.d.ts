export declare class EncryptApiCredentialSecretDtoOut {
    readonly apiCredential: Record<string, unknown>;
    readonly encryptedKeys: string[];
    constructor(apiCredential: Record<string, unknown>, encryptedKeys: string[]);
}
