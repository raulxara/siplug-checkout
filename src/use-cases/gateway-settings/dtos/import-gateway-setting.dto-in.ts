import { IsUUID } from 'class-validator';
import { SaveGatewaySettingDtoIn } from './save-gateway-setting.dto-in';
export class ImportGatewaySettingDtoIn extends SaveGatewaySettingDtoIn {
  @IsUUID() sourceCredentialId!: string;
  @IsUUID() backendUserId!: string;
  @IsUUID() backendOfficeId!: string;
}
