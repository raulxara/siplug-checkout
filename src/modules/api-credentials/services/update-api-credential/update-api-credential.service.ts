import { Inject, Injectable } from '@nestjs/common';
import { BuildChangesHistoryService } from '../../../../common/services/changes-history/build-changes-history.service';
import { BuildChangesHistoryDtoIn } from '../../../../common/services/changes-history/dtos/build-changes-history.dto-in';
import type {
  ApiCredentialRow,
  IApiCredentialsRepository,
} from '../../entities/api-credentials-repository.interface';
import { API_CREDENTIALS_REPOSITORY } from '../../tokens/api-credentials.tokens';
import { UpdateApiCredentialDtoIn } from './dtos/update-api-credential.dto-in';
import { UpdateApiCredentialDtoOut } from './dtos/update-api-credential.dto-out';

@Injectable()
export class UpdateApiCredentialService {
  constructor(
    @Inject(API_CREDENTIALS_REPOSITORY)
    private readonly repository: IApiCredentialsRepository,
    private readonly buildChangesHistoryService: BuildChangesHistoryService,
  ) {}

  async exec(
    dtoIn: UpdateApiCredentialDtoIn,
  ): Promise<UpdateApiCredentialDtoOut> {
    try {
      const currentRow = await this.repository.findByUniqueId(dtoIn._id);

      if (!currentRow) {
        throw new Error('api credential not found');
      }

      const newDataForHistory = this.removeNullValues({
        officeId: dtoIn.officeId,
        clientId: dtoIn.clientId,
        gatewayId: dtoIn.gatewayId,
        name: dtoIn.name,
        slug: dtoIn.slug,
        provider: dtoIn.provider,
        providerType: dtoIn.providerType,
        environment: dtoIn.environment,
        token: dtoIn.token !== null ? '[protected_updated]' : null,
        origin: dtoIn.origin,
        config: dtoIn.config !== null ? this.sanitizeConfig(dtoIn.config) : null,
        expiresAt: dtoIn.expiresAt,
        status: dtoIn.status,
      });

      const historyDtoOut = this.buildChangesHistoryService.exec(
        new BuildChangesHistoryDtoIn({
          currentChangesHistory: currentRow.changesHistory,
          oldData: this.buildOldData(currentRow),
          newData: newDataForHistory,
          source: dtoIn.source,
        }),
      );

      const row = await this.repository.updateByUniqueId(dtoIn._id, {
        office_id: dtoIn.officeId,
        client_id: dtoIn.clientId,
        gateway_id: dtoIn.gatewayId,
        name: dtoIn.name,
        slug: dtoIn.slug,
        provider: dtoIn.provider,
        provider_type: dtoIn.providerType,
        environment: dtoIn.environment,
        token: dtoIn.token,
        origin: dtoIn.origin,
        config: dtoIn.config,
        expires_at: dtoIn.expiresAt,
        changes_history: historyDtoOut.hasChanges
          ? historyDtoOut.changesHistory
          : currentRow.changesHistory,
        status: dtoIn.status,
      });

      return new UpdateApiCredentialDtoOut(row);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'error on update api credential';

      throw new Error(message);
    }
  }

  private removeNullValues(
    data: Record<string, unknown>,
  ): Record<string, unknown> {
    return Object.fromEntries(
      Object.entries(data).filter(([, value]) => value !== null),
    );
  }

  private buildOldData(row: ApiCredentialRow): Record<string, unknown> {
    return {
      officeId: row.officeId,
      clientId: row.clientId,
      gatewayId: row.gatewayId,
      name: row.name,
      slug: row.slug,
      provider: row.provider,
      providerType: row.providerType,
      environment: row.environment,
      token: row.token ? '[protected_current]' : null,
      origin: row.origin,
      config: row.config ? this.sanitizeConfig(row.config) : null,
      expiresAt: row.expiresAt,
      status: row.status,
    };
  }

  private sanitizeConfig(
    config: Record<string, unknown>,
  ): Record<string, unknown> {
    const sanitized: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(config)) {
      const normalizedKey = key.toLowerCase();

      if (this.isSensitiveKey(normalizedKey)) {
        sanitized[key] = '[protected]';
        continue;
      }

      if (value && typeof value === 'object' && !Array.isArray(value)) {
        sanitized[key] = this.sanitizeConfig(value as Record<string, unknown>);
        continue;
      }

      sanitized[key] = value;
    }

    return sanitized;
  }

  private isSensitiveKey(key: string): boolean {
    return [
      'token',
      'client_token',
      'secret',
      'password',
      'apikey',
      'api_key',
      'clientsecret',
      'client_secret',
      'accesstoken',
      'access_token',
      'privatekey',
      'private_key',
      'webhooksecret',
      'webhook_secret',
    ].includes(key);
  }
}