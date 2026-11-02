import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { GatewaySettingAuthorizationService } from '../../modules/gateway-settings/services/gateway-setting-authorization.service';
import { GatewaySettingsRepository } from '../../modules/gateway-settings/repositories/gateway-settings.repository';
import { GatewayDefinitionService } from '../../modules/gateway-settings/services/gateway-definition.service';
import { GatewaySettingViewService } from '../../modules/gateway-settings/services/gateway-setting-view.service';
import { SaveGatewaySettingDtoIn } from './dtos/save-gateway-setting.dto-in';
import { BuildGatewaySettingService } from '../../modules/gateway-settings/services/build-gateway-setting.service';
@Injectable()
export class SaveGatewaySettingUseCase {
  constructor(
    private readonly authorization: GatewaySettingAuthorizationService,
    private readonly repository: GatewaySettingsRepository,
    private readonly definitions: GatewayDefinitionService,
    private readonly view: GatewaySettingViewService,
    private readonly builder: BuildGatewaySettingService,
  ) {}
  async exec(token: string, gatewayId: string, input: SaveGatewaySettingDtoIn) {
    const actor = await this.authorization.exec(
      token,
      input.credentialId ? 'updateApiCredential' : 'registerApiCredential',
    );
    await this.authorization.exec(token, 'activateApiCredential');
    const gateway = (await this.repository.gateways()).find(
      (g) => g.unique_id === gatewayId,
    );
    if (!gateway) throw new NotFoundException();
    const definition = this.definitions.resolve(gateway.provider);
    if (!definition.modes.length)
      throw new BadRequestException('Gateway ainda não implementado.');
    if (
      input.modes.some((m) => !definition.modes.includes(m)) ||
      input.defaultModes.some((m) => !input.modes.includes(m)) ||
      (!input.modes.length && input.status === 'active')
    )
      throw new BadRequestException(
        'Selecione modalidades hospedadas válidas.',
      );
    const result = await this.repository.save(
      actor.officeId,
      gatewayId,
      input.environment,
      input.credentialId,
      input.version,
      (old) => {
        return this.builder.exec(old, actor, gateway, definition, input);
      },
    );
    return {
      ...this.view.build(gateway, [result.credential]),
      updatedDefaults: result.updatedDefaults,
    };
  }
}
