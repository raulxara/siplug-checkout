import { Module } from '@nestjs/common';
import { SecurityModule } from '../../modules/security/security.module';
import { GetAuthContextModule } from '../get-auth-context/get-auth-context.module';
import { GatewaySettingAuthorizationService } from '../../modules/gateway-settings/services/gateway-setting-authorization.service';
import { CheckoutGeneralSettingsRepository } from '../../modules/checkout-settings/repositories/checkout-general-settings.repository';
import { GetCheckoutGeneralSettingsUseCase } from './get-checkout-general-settings.use-case';
import { SaveCheckoutGeneralSettingsUseCase } from './save-checkout-general-settings.use-case';
import { CheckoutGeneralSettingsController } from './checkout-general-settings.controller';
@Module({
  imports: [SecurityModule, GetAuthContextModule],
  controllers: [CheckoutGeneralSettingsController],
  providers: [
    GatewaySettingAuthorizationService,
    CheckoutGeneralSettingsRepository,
    GetCheckoutGeneralSettingsUseCase,
    SaveCheckoutGeneralSettingsUseCase,
  ],
})
export class CheckoutGeneralSettingsModule {}
