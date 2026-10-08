import { Injectable } from '@nestjs/common';
import { GatewaySettingAuthorizationService } from '../../modules/gateway-settings/services/gateway-setting-authorization.service';
import { CheckoutGeneralSettingsRepository } from '../../modules/checkout-settings/repositories/checkout-general-settings.repository';
import { CheckoutGeneralSettingsDtoOut } from './dtos/checkout-general-settings.dto-out';
@Injectable()
export class GetCheckoutGeneralSettingsUseCase {
  constructor(
    private readonly auth: GatewaySettingAuthorizationService,
    private readonly repository: CheckoutGeneralSettingsRepository,
  ) {}
  async exec(token: string) {
    const actor = await this.auth.exec(token, 'listApiCredentialByOfficeId');
    return new CheckoutGeneralSettingsDtoOut(
      await this.repository.read(actor.officeId),
    );
  }
}
