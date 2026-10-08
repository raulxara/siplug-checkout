import { ImportGatewaySettingUseCase } from './import-gateway-setting.use-case';
import { Module } from '@nestjs/common';
import { ApiCredentialsModule } from '../../modules/api-credentials/api-credentials.module';
import { SecurityModule } from '../../modules/security/security.module';
import { GetAuthContextModule } from '../get-auth-context/get-auth-context.module';
import { GatewaySettingsRepository } from '../../modules/gateway-settings/repositories/gateway-settings.repository';
import { GatewayDefinitionService } from '../../modules/gateway-settings/services/gateway-definition.service';
import { GatewaySettingSecurityService } from '../../modules/gateway-settings/services/gateway-setting-security.service';
import { GatewaySettingViewService } from '../../modules/gateway-settings/services/gateway-setting-view.service';
import { GatewaySettingConnectionService } from '../../modules/gateway-settings/services/gateway-setting-connection.service';
import { GatewaySettingsController } from './gateway-settings.controller';
import { ListGatewaySettingsUseCase } from './list-gateway-settings.use-case';
import { SaveGatewaySettingUseCase } from './save-gateway-setting.use-case';
import { VerifyGatewaySettingUseCase } from './verify-gateway-setting.use-case';
import { BuildGatewaySettingService } from '../../modules/gateway-settings/services/build-gateway-setting.service';
import { GatewaySettingAuthorizationService } from '../../modules/gateway-settings/services/gateway-setting-authorization.service';
@Module({
  imports: [ApiCredentialsModule, SecurityModule, GetAuthContextModule],
  controllers: [GatewaySettingsController],
  providers: [
    ImportGatewaySettingUseCase,
    GatewaySettingsRepository,
    GatewayDefinitionService,
    GatewaySettingSecurityService,
    GatewaySettingViewService,
    GatewaySettingConnectionService,
    ListGatewaySettingsUseCase,
    SaveGatewaySettingUseCase,
    VerifyGatewaySettingUseCase,
    BuildGatewaySettingService,
    GatewaySettingAuthorizationService,
  ],
})
export class GatewaySettingsModule {}
