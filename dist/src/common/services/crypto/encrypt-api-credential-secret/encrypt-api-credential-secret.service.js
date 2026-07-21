"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EncryptApiCredentialSecretService = void 0;
const common_1 = require("@nestjs/common");
const crypto_1 = require("crypto");
const encrypt_api_credential_secret_dto_out_1 = require("./dtos/encrypt-api-credential-secret.dto-out");
let EncryptApiCredentialSecretService = class EncryptApiCredentialSecretService {
    exec(dtoIn) {
        try {
            const apiCredential = structuredClone(dtoIn.apiCredential);
            const encryptedKeys = [];
            const config = apiCredential.config;
            if (!config || typeof config !== 'object' || Array.isArray(config)) {
                throw new Error('api credential config is invalid');
            }
            apiCredential.config = this.encryptArrayRecursively({
                data: config,
                keysToEncrypt: dtoIn.keysToEncrypt,
                encryptedPrefix: dtoIn.encryptedPrefix,
                strict: dtoIn.strict,
                encryptedKeys,
                currentPath: 'config',
            });
            return new encrypt_api_credential_secret_dto_out_1.EncryptApiCredentialSecretDtoOut(apiCredential, encryptedKeys);
        }
        catch (error) {
            const message = error instanceof Error
                ? error.message
                : 'error encrypting api credential secret';
            throw new Error(`error encrypting api credential secret: ${message}`);
        }
    }
    encryptArrayRecursively(params) {
        const output = {};
        for (const [key, value] of Object.entries(params.data)) {
            const path = `${params.currentPath}.${key}`;
            if (value && typeof value === 'object' && !Array.isArray(value)) {
                output[key] = this.encryptArrayRecursively({
                    data: value,
                    keysToEncrypt: params.keysToEncrypt,
                    encryptedPrefix: params.encryptedPrefix,
                    strict: params.strict,
                    encryptedKeys: params.encryptedKeys,
                    currentPath: path,
                });
                continue;
            }
            if (!params.keysToEncrypt.includes(key)) {
                output[key] = value;
                continue;
            }
            if (value === null || value === undefined) {
                output[key] = value;
                continue;
            }
            if (typeof value !== 'string') {
                if (params.strict) {
                    throw new Error(`invalid value to encrypt for key ${path}`);
                }
                output[key] = value;
                continue;
            }
            const trimmedValue = value.trim();
            if (trimmedValue === '') {
                output[key] = value;
                continue;
            }
            if (trimmedValue.startsWith(params.encryptedPrefix)) {
                output[key] = value;
                continue;
            }
            output[key] = `${params.encryptedPrefix}${this.encryptValue(trimmedValue)}`;
            params.encryptedKeys.push(path);
        }
        return output;
    }
    encryptValue(rawValue) {
        const cryptKey = process.env.CRYPT_KEY ?? '';
        if (cryptKey.trim() === '') {
            throw new Error('CRYPT_KEY is required');
        }
        const key = Buffer.from(cryptKey, 'utf8');
        if (key.length !== 32) {
            throw new Error('CRYPT_KEY must have 32 bytes');
        }
        const iv = (0, crypto_1.randomBytes)(12);
        const cipher = (0, crypto_1.createCipheriv)('aes-256-gcm', key, iv);
        const encrypted = Buffer.concat([
            cipher.update(Buffer.from(rawValue, 'utf8')),
            cipher.final(),
        ]);
        const payload = {
            iv: iv.toString('base64'),
            tag: cipher.getAuthTag().toString('base64'),
            data: encrypted.toString('base64'),
        };
        return Buffer.from(JSON.stringify(payload)).toString('base64');
    }
};
exports.EncryptApiCredentialSecretService = EncryptApiCredentialSecretService;
exports.EncryptApiCredentialSecretService = EncryptApiCredentialSecretService = __decorate([
    (0, common_1.Injectable)()
], EncryptApiCredentialSecretService);
//# sourceMappingURL=encrypt-api-credential-secret.service.js.map