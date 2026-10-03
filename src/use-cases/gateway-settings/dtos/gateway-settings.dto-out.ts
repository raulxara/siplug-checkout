import { PublicGatewaySetting } from '../../../modules/gateway-settings/entities/gateway-setting.entity';
export class GatewaySettingsDtoOut {
  constructor(public readonly gateways: PublicGatewaySetting[]) {}
}
