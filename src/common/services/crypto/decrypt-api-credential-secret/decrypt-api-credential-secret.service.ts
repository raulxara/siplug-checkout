import { Injectable } from '@nestjs/common';
import { createDecipheriv } from 'crypto';
import { DecryptApiCredentialSecretDtoIn } from './dtos/decrypt-api-credential-secret.dto-in';
import { DecryptApiCredentialSecretDtoOut } from './dtos/decrypt-api-credential-secret.dto-out';

@Injectable()
export class DecryptApiCredentialSecretService {
  exec(
    dtoIn: DecryptApiCredentialSecretDtoIn,
  ): DecryptApiCredentialSecretDtoOut {
    try {
      const apiCredential = structuredClone(dtoIn.apiCredential);
      const decryptedKeys: string[] = [];

      const config = apiCredential.config;

      if (!config || typeof config !== 'object' || Array.isArray(config)) {
        throw new Error('api credential config is invalid');
      }

      apiCredential.config = this.decryptArrayRecursively({
        data: config as Record<string, unknown>,
        keysToDecrypt: dtoIn.keysToDecrypt,
        encryptedPrefix: dtoIn.encryptedPrefix,
        strict: dtoIn.strict,
        decryptedKeys,
        currentPath: 'config',
      });

      return new DecryptApiCredentialSecretDtoOut(
        apiCredential,
        decryptedKeys,
      );
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'error decrypting api credential secret';

      throw new Error(`error decrypting api credential secret: ${message}`);
    }
  }

  private decryptArrayRecursively(params: {
    data: Record<string, unknown>;
    keysToDecrypt: string[];
    encryptedPrefix: string;
    strict: boolean;
    decryptedKeys: string[];
    currentPath: string;
  }): Record<string, unknown> {
    const output: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(params.data)) {
      const path = `${params.currentPath}.${key}`;

      if (value && typeof value === 'object' && !Array.isArray(value)) {
        output[key] = this.decryptArrayRecursively({
          data: value as Record<string, unknown>,
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

      output[key] = this.decryptValue(
        trimmedValue.substring(params.encryptedPrefix.length),
      );

      params.decryptedKeys.push(path);
    }

    return output;
  }

  private decryptValue(encryptedPayload: string): string {
    const cryptKey = process.env.CRYPT_KEY ?? '';

    if (cryptKey.trim() === '') {
      throw new Error('CRYPT_KEY is required');
    }

    const key = Buffer.from(cryptKey, 'utf8');

    if (key.length !== 32) {
      throw new Error('CRYPT_KEY must have 32 bytes');
    }

    const decoded = Buffer.from(encryptedPayload, 'base64').toString('utf8');
    const payload = JSON.parse(decoded) as {
      iv: string;
      tag: string;
      data: string;
    };

    const iv = Buffer.from(payload.iv, 'base64');
    const tag = Buffer.from(payload.tag, 'base64');
    const data = Buffer.from(payload.data, 'base64');

    const decipher = createDecipheriv('aes-256-gcm', key, iv);

    decipher.setAuthTag(tag);

    const decrypted = Buffer.concat([
      decipher.update(data),
      decipher.final(),
    ]);

    return decrypted.toString('utf8');
  }
}