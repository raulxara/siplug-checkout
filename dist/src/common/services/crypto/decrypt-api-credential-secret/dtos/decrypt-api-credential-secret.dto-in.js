"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DecryptApiCredentialSecretDtoIn = void 0;
class DecryptApiCredentialSecretDtoIn {
    apiCredential;
    keysToDecrypt;
    encryptedPrefix;
    strict;
    constructor(params) {
        this.apiCredential = params.apiCredential;
        this.keysToDecrypt = params.keysToDecrypt ?? [
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
exports.DecryptApiCredentialSecretDtoIn = DecryptApiCredentialSecretDtoIn;
//# sourceMappingURL=decrypt-api-credential-secret.dto-in.js.map