import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { GatewaySettingAuthorizationService } from '../../modules/gateway-settings/services/gateway-setting-authorization.service';
import { GatewaySettingsRepository } from '../../modules/gateway-settings/repositories/gateway-settings.repository';
import { GatewayDefinitionService } from '../../modules/gateway-settings/services/gateway-definition.service';
import { GatewaySettingViewService } from '../../modules/gateway-settings/services/gateway-setting-view.service';
import { GatewaySettingsDtoOut } from './dtos/gateway-settings.dto-out';
@Injectable()
export class ListGatewaySettingsUseCase {
  constructor(
    private readonly authorization: GatewaySettingAuthorizationService,
    private readonly repository: GatewaySettingsRepository,
    private readonly view: GatewaySettingViewService,
  ) {}
  async exec(token: string) {
    const actor = await this.authorization.exec(
      token,
      'listApiCredentialByOfficeId',
    );
    const rows = await this.repository.credentials(actor.officeId);
    const gateways = await this.repository.gateways();
    return new GatewaySettingsDtoOut(
      gateways.map((g) => this.view.build(g, rows)),
    );
  }
}
