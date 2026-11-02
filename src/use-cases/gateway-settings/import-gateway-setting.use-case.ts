import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { GatewaySettingAuthorizationService } from '../../modules/gateway-settings/services/gateway-setting-authorization.service';
import { GatewaySettingsRepository } from '../../modules/gateway-settings/repositories/gateway-settings.repository';
import { GatewayDefinitionService } from '../../modules/gateway-settings/services/gateway-definition.service';
import { GatewaySettingViewService } from '../../modules/gateway-settings/services/gateway-setting-view.service';
import { BuildGatewaySettingService } from '../../modules/gateway-settings/services/build-gateway-setting.service';
import { ImportGatewaySettingDtoIn } from './dtos/import-gateway-setting.dto-in';
@Injectable()
export class ImportGatewaySettingUseCase {
  constructor(
    private readonly auth: GatewaySettingAuthorizationService,
    private readonly repository: GatewaySettingsRepository,
    private readonly definitions: GatewayDefinitionService,
    private readonly builder: BuildGatewaySettingService,
    private readonly view: GatewaySettingViewService,
  ) {}
  async exec(
    token: string,
    gatewayId: string,
    input: ImportGatewaySettingDtoIn,
  ) {
    const actor = await this.auth.exec(token, 'registerApiCredential');
    await this.auth.exec(token, 'activateApiCredential');
    if (input.credentialId || input.version || input.defaultModes.length)
      throw new BadRequestException(
        'Importação não substitui credenciais nem padrões existentes.',
      );
    const gateway = (await this.repository.gateways()).find(
      (g) => g.unique_id === gatewayId,
    );
    if (!gateway) throw new NotFoundException();
    const definition = this.definitions.resolve(gateway.provider);
    if (
      !definition.modes.length ||
      input.modes.some((m) => !definition.modes.includes(m)) ||
      (input.status === 'active' && !input.modes.length)
    )
      throw new BadRequestException('Modalidades inválidas.');
    // Metadata identifies a supplied copy; this operation never reads another tenant's source record.
    const slug = `import-${input.sourceCredentialId}-${input.backendUserId}`;
    const result = await this.repository.importCopy(
      actor.officeId,
      slug,
      () => {
        const data = this.builder.exec(null, actor, gateway, definition, input);
        data.client_id = actor.clientId;
        data.config = {
          ...(data.config as Record<string, unknown>),
          importedFrom: {
            sourceCredentialId: input.sourceCredentialId,
            backendUserId: input.backendUserId,
            backendOfficeId: input.backendOfficeId,
            importedAt: new Date().toISOString(),
          },
        } as Prisma.InputJsonValue;
        return data;
      },
    );
    return {
      ...this.view.build(gateway, [result.credential]),
      created: result.created,
    };
  }
}
