import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { GatewaySettingAuthorizationService } from '../../modules/gateway-settings/services/gateway-setting-authorization.service';
import { GatewaySettingsRepository } from '../../modules/gateway-settings/repositories/gateway-settings.repository';
import { GatewayDefinitionService } from '../../modules/gateway-settings/services/gateway-definition.service';
import { GatewaySettingViewService } from '../../modules/gateway-settings/services/gateway-setting-view.service';
import { GatewaySettingConnectionService } from '../../modules/gateway-settings/services/gateway-setting-connection.service';
@Injectable()
export class VerifyGatewaySettingUseCase {
  constructor(
    private readonly authorization: GatewaySettingAuthorizationService,
    private readonly repository: GatewaySettingsRepository,
    private readonly definitions: GatewayDefinitionService,
    private readonly connection: GatewaySettingConnectionService,
  ) {}
  async exec(token: string, id: string) {
    const actor = await this.authorization.exec(token, 'verifyApiCredential');
    const row = await this.repository.one(actor.officeId, id);
    const definition = this.definitions.resolve(row.provider);
    const status = await this.connection.verify(definition.provider, row);
    await this.repository.connection(
      actor.officeId,
      id,
      row.updated_at,
      status,
    );
    return { connectionStatus: status };
  }
}
