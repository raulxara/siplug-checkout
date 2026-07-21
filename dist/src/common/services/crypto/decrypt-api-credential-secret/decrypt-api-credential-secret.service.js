"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DecryptApiCredentialSecretService = void 0;
const common_1 = require("@nestjs/common");
const crypto_1 = require("crypto");
const decrypt_api_credential_secret_dto_out_1 = require("./dtos/decrypt-api-credential-secret.dto-out");
let DecryptApiCredentialSecretService = class DecryptApiCredentialSecretService {
    exec(dtoIn) {
        try {
            const apiCredential = structuredClone(dtoIn.apiCredential);
            const decryptedKeys = [];
            const config = apiCredential.config;
            if (!config || typeof config !== 'object' || Array.isArray(config)) {
                throw new Error('api credential config is invalid');
            }
            apiCredential.config = this.decryptArrayRecursively({
                data: config,
                keysToDecrypt: dtoIn.keysToDecrypt,
                encryptedPrefix: dtoIn.encryptedPrefix,
                strict: dtoIn.strict,
                decryptedKeys,
                currentPath: 'config',
            });
            return new decrypt_api_credential_secret_dto_out_1.DecryptApiCredentialSecretDtoOut(apiCredential, decryptedKeys);
        }
        catch (error) {
            const message = error instanceof Error
                ? error.message
                : 'error decrypting api credential secret';
            throw new Error(`error decrypting api credential secret: ${message}`);
        }
    }
    decryptArrayRecursively(params) {
        const output = {};
        for (const [key, value] of Object.entries(params.data)) {
            const path = `${params.currentPath}.${key}`;
            if (value && typeof value === 'object' && !Array.isArray(value)) {
                output[key] = this.decryptArrayRecursively({
                    data: value,
                    keysToDecrypt: params.keysToDecrypt,
                    encryptedPrefix: params.encryptedPrefix,
                    strict: params.strict,
                    decryptedKeys: params.decryptedKeys,
                    currentPath: path,
                });
                continue;
            }
            if (!params.keysToDecrypt.includes(key)) {
                output[key] = value;
                continue;
            }
            if (value === null || value === undefined) {
                output[key] = value;
                continue;
            }
            if (typeof value !== 'string') {
                if (params.strict) {
                    throw new Error(`invalid encrypted value for key ${path}`);
                }
                output[key] = value;
                continue;
            }
            const trimmedValue = value.trim();
            if (trimmedValue === '') {
                output[key] = value;
                continue;
            }
            if (!trimmedValue.startsWith(params.encryptedPrefix)) {
                if (params.strict) {
                    throw new Error(`encrypted prefix not found for key ${path}`);
                }
                output[key] = value;
                continue;
            }
            output[key] = this.decryptValue(trimmedValue.substring(params.encryptedPrefix.length));
            params.decryptedKeys.push(path);
        }
        return output;
    }
    decryptValue(encryptedPayload) {
        const cryptKey = process.env.CRYPT_KEY ?? '';
        if (cryptKey.trim() === '') {
            throw new Error('CRYPT_KEY is required');
        }
        const key = Buffer.from(cryptKey, 'utf8');
        if (key.length !== 32) {
            throw new Error('CRYPT_KEY must have 32 bytes');
        }
        const decoded = Buffer.from(encryptedPayload, 'base64').toString('utf8');
        const payload = JSON.parse(decoded);
        const iv = Buffer.from(payload.iv, 'base64');
        const tag = Buffer.from(payload.tag, 'base64');
        const data = Buffer.from(payload.data, 'base64');
        const decipher = (0, crypto_1.createDecipheriv)('aes-256-gcm', key, iv);
        decipher.setAuthTag(tag);
        const decrypted = Buffer.concat([
            decipher.update(data),
            decipher.final(),
        ]);
        return decrypted.toString('utf8');
    }
};
exports.DecryptApiCredentialSecretService = DecryptApiCredentialSecretService;
exports.DecryptApiCredentialSecretService = DecryptApiCredentialSecretService = __decorate([
    (0, common_1.Injectable)()
], DecryptApiCredentialSecretService);
//# sourceMappingURL=decrypt-api-credential-secret.service.js.map