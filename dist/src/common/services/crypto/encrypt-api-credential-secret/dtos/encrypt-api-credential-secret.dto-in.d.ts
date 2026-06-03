export declare class EncryptApiCredentialSecretDtoIn {
    readonly apiCredential: Record<string, unknown>;
    readonly keysToEncrypt: string[];
    readonly encryptedPrefix: string;
    readonly strict: boolean;
    constructor(params: {
        apiCredential: Record<string, unknown>;
        keysToEncrypt?: string[];
        encryptedPrefix?: string;
        strict?: boolean;
    });
}
