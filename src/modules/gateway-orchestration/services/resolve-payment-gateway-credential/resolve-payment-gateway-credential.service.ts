import { Inject, Injectable } from '@nestjs/common';

import { DecryptApiCredentialSecretDtoIn } from '../../../../common/services/crypto/decrypt-api-credential-secret/dtos/decrypt-api-credential-secret.dto-in';
import { DecryptApiCredentialSecretService } from '../../../../common/services/crypto/decrypt-api-credential-secret/decrypt-api-credential-secret.service';

import type {
  ApiCredentialRow,
  IApiCredentialsRepository,
} from '../../../api-credentials/entities/api-credentials-repository.interface';
import { API_CREDENTIALS_REPOSITORY } from '../../../api-credentials/tokens/api-credentials.tokens';

import { FindGatewayByUniqueIdDtoIn } from '../../../gateways/services/find-gateway-by-unique-id/dtos/find-gateway-by-unique-id.dto-in';
import { FindGatewayByUniqueIdService } from '../../../gateways/services/find-gateway-by-unique-id/find-gateway-by-unique-id.service';

import type { GatewayRow } from '../../../gateways/entities/gateways-repository.interface';

import { ResolvePaymentGatewayCredentialDtoIn } from './dtos/resolve-payment-gateway-credential.dto-in';
import { ResolvePaymentGatewayCredentialDtoOut } from './dtos/resolve-payment-gateway-credential.dto-out';

type Candidate = {
  apiCredential: ApiCredentialRow;
  gateway: GatewayRow;
  priority: number;
  isDefault: boolean;
};

@Injectable()
export class ResolvePaymentGatewayCredentialService {
  constructor(
    @Inject(API_CREDENTIALS_REPOSITORY)
    private readonly apiCredentialsRepository: IApiCredentialsRepository,
    private readonly findGatewayByUniqueIdService: FindGatewayByUniqueIdService,
    private readonly decryptApiCredentialSecretService: DecryptApiCredentialSecretService,
  ) {}

  async exec(
    dtoIn: ResolvePaymentGatewayCredentialDtoIn,
  ): Promise<ResolvePaymentGatewayCredentialDtoOut> {
    try {
      const allApiCredentials = await this.apiCredentialsRepository.getAll();

      const apiCredentials = allApiCredentials.filter(
        (apiCredential) => apiCredential.officeId === dtoIn.officeId,
      );

      const candidates: Candidate[] = [];

      for (const apiCredential of apiCredentials) {
        if (apiCredential.status !== 'active') {
          continue;
        }

        const credentialBelongsToClient =
          apiCredential.clientId === dtoIn.clientId ||
          apiCredential.clientId === null;

        if (!credentialBelongsToClient) {
          continue;
        }

        if (apiCredential.gatewayId === null) {
          continue;
        }

        if (!this.credentialSupportsPaymentContext(apiCredential, dtoIn)) {
          continue;
        }

        const gatewayDtoOut = await this.findGatewayByUniqueIdService.exec(
          new FindGatewayByUniqueIdDtoIn(apiCredential.gatewayId),
        );

        const gateway = gatewayDtoOut.gateway;

        if (gateway.status !== 'active') {
          continue;
        }

        if (!this.gatewaySupportsPaymentContext(gateway, dtoIn)) {
          continue;
        }

        candidates.push({
          apiCredential,
          gateway,
          priority: this.resolvePriority(apiCredential.config),
          isDefault: this.resolveIsDefault(apiCredential.config),
        });
      }

      if (candidates.length === 0) {
        throw new Error(
          'active gateway credential not found for payment context',
        );
      }

      const selected = candidates.sort((a, b) => {
        if (a.isDefault !== b.isDefault) {
          return a.isDefault ? -1 : 1;
        }

        return a.priority - b.priority;
      })[0];

      if (!selected.apiCredential.token || selected.apiCredential.token.trim() === '') {
        throw new Error('api credential token is required');
      }

      const decryptedProviderToken = this.decryptProviderToken(
        selected.apiCredential.token,
      );

      const connectionData = {
        token: decryptedProviderToken,
        config: selected.apiCredential.config,
        gatewayProvider: selected.gateway.provider,
        gatewaySlug: selected.gateway.slug,
        apiCredentialId: selected.apiCredential._id,
        gatewayId: selected.gateway._id,
      };

      return new ResolvePaymentGatewayCredentialDtoOut(
        selected.gateway,
        selected.apiCredential,
        decryptedProviderToken,
        connectionData,
      );
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'error on resolve payment gateway credential';

      throw new Error(message);
    }
  }

  private credentialSupportsPaymentContext(
    apiCredential: ApiCredentialRow,
    dtoIn: ResolvePaymentGatewayCredentialDtoIn,
  ): boolean {
    const config = apiCredential.config ?? {};

    const paymentTypes = this.asStringArray(
      config.paymentTypes ?? config.payment_types,
    );

    const paymentMethods = this.asStringArray(
      config.paymentMethods ?? config.payment_methods,
    );

    if (paymentTypes.length > 0 && !paymentTypes.includes(dtoIn.paymentType)) {
      return false;
    }

    if (
      paymentMethods.length > 0 &&
      !paymentMethods.includes(dtoIn.paymentMethod)
    ) {
      return false;
    }

    return true;
  }

  private gatewaySupportsPaymentContext(
    gateway: GatewayRow,
    dtoIn: ResolvePaymentGatewayCredentialDtoIn,
  ): boolean {
    const config = gateway.config ?? {};

    if (
      dtoIn.paymentType === 'one_time' &&
      config.supportsOneTimePayment === false
    ) {
      return false;
    }

    if (
      dtoIn.paymentType === 'installment' &&
      config.supportsInstallments === false
    ) {
      return false;
    }

    if (
      dtoIn.paymentType === 'recurring' &&
      config.supportsRecurringPayment === false
    ) {
      return false;
    }

    const supportedPaymentMethods = this.asStringArray(
      config.supportedPaymentMethods ?? config.supported_payment_methods,
    );

    if (
      supportedPaymentMethods.length > 0 &&
      !supportedPaymentMethods.includes(dtoIn.paymentMethod)
    ) {
      return false;
    }

    return true;
  }

  private decryptProviderToken(encryptedToken: string): string {
    const dtoOut = this.decryptApiCredentialSecretService.exec(
      new DecryptApiCredentialSecretDtoIn({
        apiCredential: {
          config: {
            token: encryptedToken,
          },
        },
        keysToDecrypt: ['token'],
        encryptedPrefix: 'enc::',
        strict: true,
      }),
    );

    const config = dtoOut.apiCredential.config;

    if (!config || typeof config !== 'object' || Array.isArray(config)) {
      throw new Error('decrypted api credential config is invalid');
    }

    const token = (config as Record<string, unknown>).token;

    if (typeof token !== 'string' || token.trim() === '') {
      throw new Error('decrypted api credential token is invalid');
    }

    return token;
  }

  private resolvePriority(config: Record<string, unknown> | null): number {
    const value = config?.priority;

    if (typeof value === 'number' && Number.isFinite(value)) {
      return value;
    }

    if (typeof value === 'string' && value.trim() !== '') {
      const parsed = Number(value);

      return Number.isFinite(parsed) ? parsed : 999;
    }

    return 999;
  }

  private resolveIsDefault(config: Record<string, unknown> | null): boolean {
    return config?.isDefault === true || config?.is_default === true;
  }

  private asStringArray(value: unknown): string[] {
    if (!Array.isArray(value)) {
      return [];
    }

    return value
      .map((item) => String(item).trim())
      .filter((item) => item !== '');
  }
}
