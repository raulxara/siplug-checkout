"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EncryptApiCredentialSecretDtoIn = void 0;
class EncryptApiCredentialSecretDtoIn {
    apiCredential;
    keysToEncrypt;
    encryptedPrefix;
    strict;
    constructor(params) {
        this.apiCredential = params.apiCredential;
        this.keysToEncrypt = params.keysToEncrypt ?? [
            'token',
            'secret',
            'password',
            'apiKey',
            'api_key',
            'clientSecret',
            'client_secret',
            'accessToken',
            'access_token',
            'privateKey',
            'private_key',
            'webhookSecret',
            'webhook_secret',
        ];
        this.encryptedPrefix = params.encryptedPrefix ?? 'enc::';
        this.strict = params.strict ?? false;
    }
}
exports.EncryptApiCredentialSecretDtoIn = EncryptApiCredentialSecretDtoIn;
//# sourceMappingURL=encrypt-api-credential-secret.dto-in.js.map