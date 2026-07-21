import { Injectable } from '@nestjs/common';
import { EncryptApiCredentialSecretDtoIn } from '../../common/services/crypto/encrypt-api-credential-secret/dtos/encrypt-api-credential-secret.dto-in';
import { EncryptApiCredentialSecretService } from '../../common/services/crypto/encrypt-api-credential-secret/encrypt-api-credential-secret.service';
import { HandleUseCaseExceptionDtoIn } from '../../common/services/use-case-support/dtos/handle-use-case-exception.dto-in';
import { HandleUseCaseExceptionService } from '../../common/services/use-case-support/handle-use-case-exception.service';
import { CreateApiCredentialDtoIn } from '../../modules/api-credentials/services/create-api-credential/dtos/create-api-credential.dto-in';
import { CreateApiCredentialService } from '../../modules/api-credentials/services/create-api-credential/create-api-credential.service';
import { NormalizeApiCredentialConfigDtoIn } from '../../modules/api-credentials/services/normalize-api-credential-config/dtos/normalize-api-credential-config.dto-in';
import { NormalizeApiCredentialConfigService } from '../../modules/api-credentials/services/normalize-api-credential-config/normalize-api-credential-config.service';
import { ValidateApiCredentialSlugUniquenessDtoIn } from '../../modules/api-credentials/services/validate-api-credential-slug-uniqueness/dtos/validate-api-credential-slug-uniqueness.dto-in';
import { ValidateApiCredentialSlugUniquenessService } from '../../modules/api-credentials/services/validate-api-credential-slug-uniqueness/validate-api-credential-slug-uniqueness.service';
import { FindClientByUniqueIdDtoIn } from '../../modules/clients/services/find-client-by-unique-id/dtos/find-client-by-unique-id.dto-in';
import { FindClientByUniqueIdService } from '../../modules/clients/services/find-client-by-unique-id/find-client-by-unique-id.service';
import { FindOfficeByUniqueIdDtoIn } from '../../modules/offices/services/find-office-by-unique-id/dtos/find-office-by-unique-id.dto-in';
import { FindOfficeByUniqueIdService } from '../../modules/offices/services/find-office-by-unique-id/find-office-by-unique-id.service';
import { ResolveActorAuthorizationDtoIn } from '../../modules/security/services/resolve-actor-authorization/dtos/resolve-actor-authorization.dto-in';
import { ResolveActorAuthorizationService } from '../../modules/security/services/resolve-actor-authorization/resolve-actor-authorization.service';
import { RegisterApiCredentialDtoIn } from './dtos/register-api-credential.dto-in';
import { RegisterApiCredentialDtoOut } from './dtos/register-api-credential.dto-out';

@Injectable()
export class RegisterApiCredentialUseCase {
  constructor(
    private readonly resolveActorAuthorizationService: ResolveActorAuthorizationService,
    private readonly findOfficeByUniqueIdService: FindOfficeByUniqueIdService,
    private readonly findClientByUniqueIdService: FindClientByUniqueIdService,
    private readonly validateApiCredentialSlugUniquenessService: ValidateApiCredentialSlugUniquenessService,
    private readonly normalizeApiCredentialConfigService: NormalizeApiCredentialConfigService,
    private readonly encryptApiCredentialSecretService: EncryptApiCredentialSecretService,
    private readonly createApiCredentialService: CreateApiCredentialService,
    private readonly handleUseCaseExceptionService: HandleUseCaseExceptionService,
  ) {}

  async exec(
    dtoIn: RegisterApiCredentialDtoIn,
  ): Promise<RegisterApiCredentialDtoOut> {
    try {
      await this.resolveActorAuthorizationService.exec(
        new ResolveActorAuthorizationDtoIn({
          token: dtoIn.token,
          requiredAction: 'registerApiCredential',
          requiredEntity: 'api_credentials',
        }),
      );

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

      await this.validateApiCredentialSlugUniquenessService.exec(
        new ValidateApiCredentialSlugUniquenessDtoIn({
          officeId: dtoIn.officeId,
          slug: dtoIn.slug,
        }),
      );

      const normalizedConfigDtoOut =
        this.normalizeApiCredentialConfigService.exec(
          new NormalizeApiCredentialConfigDtoIn({
            slug: dtoIn.slug,
            config: dtoIn.config,
          }),
        );

      const encryptedTokenDtoOut = this.encryptApiCredentialSecretService.exec(
        new EncryptApiCredentialSecretDtoIn({
          apiCredential: {
            config: {
              token: dtoIn.providerToken,
            },
          },
          keysToEncrypt: ['token'],
          encryptedPrefix: 'enc::',
          strict: true,
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

      const encryptedConfig = encryptedConfigDtoOut.apiCredential.config;

      if (
        !encryptedConfig ||
        typeof encryptedConfig !== 'object' ||
        Array.isArray(encryptedConfig)
      ) {
        throw new Error('encrypted api credential config is invalid');
      }

      const created = await this.createApiCredentialService.exec(
        new CreateApiCredentialDtoIn({
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
          config: encryptedConfig as Record<string, unknown>,
          expiresAt: dtoIn.expiresAt,
          status: dtoIn.status,
        }),
      );

      return RegisterApiCredentialDtoOut.fromCreateApiCredentialDtoOut(
        created,
      );
    } catch (error) {
      await this.handleUseCaseExceptionService.exec(
        new HandleUseCaseExceptionDtoIn({
          useCase: 'RegisterApiCredentialUseCase',
          error,
          appFile: __filename,
          context: {
            officeId: dtoIn.officeId,
            clientId: dtoIn.clientId,
            gatewayId: dtoIn.gatewayId,
            name: dtoIn.name,
            slug: dtoIn.slug,
            provider: dtoIn.provider,
            providerType: dtoIn.providerType,
            environment: dtoIn.environment,
            origin: dtoIn.origin,
            status: dtoIn.status,
          },
        }),
      );

      const message =
        error instanceof Error
          ? error.message
          : 'error on register api credential use case';

      throw new Error(message);
    }
  }
}