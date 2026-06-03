export declare class DecryptApiCredentialSecretDtoOut {
    readonly apiCredential: Record<string, unknown>;
    readonly decryptedKeys: string[];
    constructor(apiCredential: Record<string, unknown>, decryptedKeys: string[]);
}
