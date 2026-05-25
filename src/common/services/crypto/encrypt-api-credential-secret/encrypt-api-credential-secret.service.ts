import { Injectable } from '@nestjs/common';
import { createCipheriv, randomBytes } from 'crypto';
import { EncryptApiCredentialSecretDtoIn } from './dtos/encrypt-api-credential-secret.dto-in';
import { EncryptApiCredentialSecretDtoOut } from './dtos/encrypt-api-credential-secret.dto-out';

@Injectable()
export class EncryptApiCredentialSecretService {
  exec(
    dtoIn: EncryptApiCredentialSecretDtoIn,
  ): EncryptApiCredentialSecretDtoOut {
    try {
      const apiCredential = structuredClone(dtoIn.apiCredential);
      const encryptedKeys: string[] = [];

      const config = apiCredential.config;

      if (!config || typeof config !== 'object' || Array.isArray(config)) {
        throw new Error('api credential config is invalid');
      }

      apiCredential.config = this.encryptArrayRecursively({
        data: config as Record<string, unknown>,
        keysToEncrypt: dtoIn.keysToEncrypt,
        encryptedPrefix: dtoIn.encryptedPrefix,
        strict: dtoIn.strict,
        encryptedKeys,
        currentPath: 'config',
      });

      return new EncryptApiCredentialSecretDtoOut(
        apiCredential,
        encryptedKeys,
      );
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'error encrypting api credential secret';

      throw new Error(`error encrypting api credential secret: ${message}`);
    }
  }

  private encryptArrayRecursively(params: {
    data: Record<string, unknown>;
    keysToEncrypt: string[];
    encryptedPrefix: string;
    strict: boolean;
    encryptedKeys: string[];
    currentPath: string;
  }): Record<string, unknown> {
    const output: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(params.data)) {
      const path = `${params.currentPath}.${key}`;

      if (value && typeof value === 'object' && !Array.isArray(value)) {
        output[key] = this.encryptArrayRecursively({
          data: value as Record<string, unknown>,
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

  private encryptValue(rawValue: string): string {
    const cryptKey = process.env.CRYPT_KEY ?? '';

    if (cryptKey.trim() === '') {
      throw new Error('CRYPT_KEY is required');
    }

    const key = Buffer.from(cryptKey, 'utf8');

    if (key.length !== 32) {
      throw new Error('CRYPT_KEY must have 32 bytes');
    }

    const iv = randomBytes(12);
    const cipher = createCipheriv('aes-256-gcm', key, iv);

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
}