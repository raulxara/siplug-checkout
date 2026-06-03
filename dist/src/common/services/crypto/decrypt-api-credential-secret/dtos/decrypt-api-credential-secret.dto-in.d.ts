export declare class DecryptApiCredentialSecretDtoIn {
    readonly apiCredential: Record<string, unknown>;
    readonly keysToDecrypt: string[];
    readonly encryptedPrefix: string;
    readonly strict: boolean;
    constructor(params: {
        apiCredential: Record<string, unknown>;
        keysToDecrypt?: string[];
        encryptedPrefix?: string;
        strict?: boolean;
    });
}
