import { Injectable } from '@nestjs/common';
import { EncryptApiCredentialSecretDtoIn } from '../../common/services/crypto/encrypt-api-credential-secret/dtos/encrypt-api-credential-secret.dto-in';
import { EncryptApiCredentialSecretService } from '../../common/services/crypto/encrypt-api-credential-secret/encrypt-api-credential-secret.service';
import { HandleUseCaseExceptionDtoIn } from '../../common/services/use-case-support/dtos/handle-use-case-exception.dto-in';
import { HandleUseCaseExceptionService } from '../../common/services/use-case-support/handle-use-case-exception.service';
import type { ApiCredentialRow } from '../../modules/api-credentials/entities/api-credentials-repository.interface';
import { FindApiCredentialByUniqueIdDtoIn } from '../../modules/api-credentials/services/find-api-credential-by-unique-id/dtos/find-api-credential-by-unique-id.dto-in';
import { FindApiCredentialByUniqueIdService } from '../../modules/api-credentials/services/find-api-credential-by-unique-id/find-api-credential-by-unique-id.service';
import { NormalizeApiCredentialConfigDtoIn } from '../../modules/api-credentials/services/normalize-api-credential-config/dtos/normalize-api-credential-config.dto-in';
import { NormalizeApiCredentialConfigService } from '../../modules/api-credentials/services/normalize-api-credential-config/normalize-api-credential-config.service';
import { UpdateApiCredentialDtoIn as UpdateApiCredentialServiceDtoIn } from '../../modules/api-credentials/services/update-api-credential/dtos/update-api-credential.dto-in';
import { UpdateApiCredentialService } from '../../modules/api-credentials/services/update-api-credential/update-api-credential.service';
import { ValidateApiCredentialSlugUniquenessDtoIn } from '../../modules/api-credentials/services/validate-api-credential-slug-uniqueness/dtos/validate-api-credential-slug-uniqueness.dto-in';
import { ValidateApiCredentialSlugUniquenessService } from '../../modules/api-credentials/services/validate-api-credential-slug-uniqueness/validate-api-credential-slug-uniqueness.service';
import { FindClientByUniqueIdDtoIn } from '../../modules/clients/services/find-client-by-unique-id/dtos/find-client-by-unique-id.dto-in';
import { FindClientByUniqueIdService } from '../../modules/clients/services/find-client-by-unique-id/find-client-by-unique-id.service';
import { FindOfficeByUniqueIdDtoIn } from '../../modules/offices/services/find-office-by-unique-id/dtos/find-office-by-unique-id.dto-in';
import { FindOfficeByUniqueIdService } from '../../modules/offices/services/find-office-by-unique-id/find-office-by-unique-id.service';
import { ResolveActorAuthorizationDtoIn } from '../../modules/security/services/resolve-actor-authorization/dtos/resolve-actor-authorization.dto-in';
import { ResolveActorAuthorizationService } from '../../modules/security/services/resolve-actor-authorization/resolve-actor-authorization.service';
import { UpdateApiCredentialDtoIn } from './dtos/update-api-credential.dto-in';
import {
  SafeUpdatedApiCredentialRow,
  UpdateApiCredentialDtoOut,
} from './dtos/update-api-credential.dto-out';

@Injectable()
export class UpdateApiCredentialUseCase {
  constructor(
    private readonly resolveActorAuthorizationService: ResolveActorAuthorizationService,
    private readonly findApiCredentialByUniqueIdService: FindApiCredentialByUniqueIdService,
    private readonly findOfficeByUniqueIdService: FindOfficeByUniqueIdService,
    private readonly findClientByUniqueIdService: FindClientByUniqueIdService,
    private readonly validateApiCredentialSlugUniquenessService: ValidateApiCredentialSlugUniquenessService,
    private readonly normalizeApiCredentialConfigService: NormalizeApiCredentialConfigService,
    private readonly encryptApiCredentialSecretService: EncryptApiCredentialSecretService,
    private readonly updateApiCredentialService: UpdateApiCredentialService,
    private readonly handleUseCaseExceptionService: HandleUseCaseExceptionService,
  ) {}

  async exec(
    dtoIn: UpdateApiCredentialDtoIn,
  ): Promise<UpdateApiCredentialDtoOut> {
    try {
      await this.resolveActorAuthorizationService.exec(
        new ResolveActorAuthorizationDtoIn({
          token: dtoIn.token,
          requiredAction: 'updateApiCredential',
          requiredEntity: 'api_credentials',
        }),
      );

      const currentDtoOut = await this.findApiCredentialByUniqueIdService.exec(
        new FindApiCredentialByUniqueIdDtoIn(dtoIn.apiCredentialId),
      );

      const current = currentDtoOut.apiCredential;

      if (dtoIn.officeId !== null) {
        await this.findOfficeByUniqueIdService.exec(
          new FindOfficeByUniqueIdDtoIn(dtoIn.officeId),
        );
      }

      if (dtoIn.clientId !== null) {
        await this.findClientByUniqueIdService.exec(
          new FindClientByUniqueIdDtoIn(dtoIn.clientId),
        );
      }

      const effectiveOfficeId = dtoIn.officeId ?? current.officeId;
      const effectiveSlug = dtoIn.slug ?? current.slug;

      const slugChanged =
        effectiveSlug !== current.slug || effectiveOfficeId !== current.officeId;

      if (slugChanged) {
        await this.validateApiCredentialSlugUniquenessService.exec(
          new ValidateApiCredentialSlugUniquenessDtoIn({
            officeId: effectiveOfficeId,
            slug: effectiveSlug,
          }),
        );
      }

      const encryptedToken = this.encryptProviderTokenIfNeeded(
        dtoIn.providerToken,
      );

      const encryptedConfig = this.encryptConfigIfNeeded({
        slug: effectiveSlug,
        config: dtoIn.config,
      });

      const updatedDtoOut = await this.updateApiCredentialService.exec(
        new UpdateApiCredentialServiceDtoIn({
          _id: dtoIn.apiCredentialId,
          officeId: dtoIn.officeId,
          clientId: dtoIn.clientId,
          gatewayId: dtoIn.gatewayId,
          name: dtoIn.name,
          slug: dtoIn.slug,
          provider: dtoIn.provider,
          providerType: dtoIn.providerType,
          environment: dtoIn.environment,
          token: encryptedToken,
          origin: dtoIn.origin,
          config: encryptedConfig,
          expiresAt: dtoIn.expiresAt,
          status: dtoIn.status,
          source: dtoIn.source,
        }),
      );

      return new UpdateApiCredentialDtoOut(
        this.hideSensitiveToken(updatedDtoOut.apiCredential, encryptedToken !== null),
      );
    } catch (error) {
      await this.handleUseCaseExceptionService.exec(
        new HandleUseCaseExceptionDtoIn({
          useCase: 'UpdateApiCredentialUseCase',
          error,
          appFile: __filename,
          context: {
            apiCredentialId: dtoIn.apiCredentialId,
            officeId: dtoIn.officeId,
            clientId: dtoIn.clientId,
            gatewayId: dtoIn.gatewayId,
            name: dtoIn.name,
            slug: dtoIn.slug,
            provider: dtoIn.provider,
            providerType: dtoIn.providerType,
            environment: dtoIn.environment,
            origin: dtoIn.origin,
            expiresAt: dtoIn.expiresAt,
            status: dtoIn.status,
            source: dtoIn.source,
          },
        }),
      );

      const message =
        error instanceof Error
          ? error.message
          : 'error on update api credential use case';

      throw new Error(message);
    }
  }

  private encryptProviderTokenIfNeeded(
    providerToken: string | null,
  ): string | null {
    if (providerToken === null || providerToken.trim() === '') {
      return null;
    }

    const encryptedTokenDtoOut = this.encryptApiCredentialSecretService.exec(
      new EncryptApiCredentialSecretDtoIn({
        apiCredential: {
          config: {
            token: providerToken,
          },
        },
        keysToEncrypt: ['token'],
        encryptedPrefix: 'enc::',
        strict: true,
      }),
    );

    const encryptedTokenConfig = encryptedTokenDtoOut.apiCredential.config;

    if (
      !encryptedTokenConfig ||
      typeof encryptedTokenConfig !== 'object' ||
      Array.isArray(encryptedTokenConfig)
    ) {
      throw new Error('encrypted token config is invalid');
    }

    const encryptedToken = String(
      (encryptedTokenConfig as Record<string, unknown>).token ?? '',
    );

    if (encryptedToken.trim() === '') {
      throw new Error('encrypted token is invalid');
    }

    return encryptedToken;
  }

  private encryptConfigIfNeeded(params: {
    slug: string;
    config: Record<string, unknown> | null;
  }): Record<string, unknown> | null {
    if (params.config === null) {
      return null;
    }

    const normalizedConfigDtoOut = this.normalizeApiCredentialConfigService.exec(
      new NormalizeApiCredentialConfigDtoIn({
        slug: params.slug,
        config: params.config,
      }),
    );

    const encryptedConfigDtoOut = this.encryptApiCredentialSecretService.exec(
      new EncryptApiCredentialSecretDtoIn({
        apiCredential: {
          config: normalizedConfigDtoOut.config,
        },
        keysToEncrypt: [
          'client_token',
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
        ],
        encryptedPrefix: 'enc::',
        strict: false,
      }),
    );

    const encryptedConfig = encryptedConfigDtoOut.apiCredential.config;

    if (
      !encryptedConfig ||
      typeof encryptedConfig !== 'object' ||
      Array.isArray(encryptedConfig)
    ) {
      throw new Error('encrypted api credential config is invalid');
    }

    return encryptedConfig as Record<string, unknown>;
  }

  private hideSensitiveToken(
    apiCredential: ApiCredentialRow,
    tokenUpdated: boolean,
  ): SafeUpdatedApiCredentialRow {
    return {
      id: apiCredential.id,
      _id: apiCredential._id,
      officeId: apiCredential.officeId,
      clientId: apiCredential.clientId,
      gatewayId: apiCredential.gatewayId,
      name: apiCredential.name,
      slug: apiCredential.slug,
      provider: apiCredential.provider,
      providerType: apiCredential.providerType,
      environment: apiCredential.environment,
      origin: apiCredential.origin,
      config: apiCredential.config,
      expiresAt: apiCredential.expiresAt,
      changesHistory: apiCredential.changesHistory,
      status: apiCredential.status,
      createdAt: apiCredential.createdAt,
      updatedAt: apiCredential.updatedAt,
      tokenUpdated,
    };
  }
}