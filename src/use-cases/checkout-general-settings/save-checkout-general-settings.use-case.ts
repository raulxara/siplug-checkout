import { Injectable } from '@nestjs/common';
import { GatewaySettingAuthorizationService } from '../../modules/gateway-settings/services/gateway-setting-authorization.service';
import { CheckoutGeneralSettingsRepository } from '../../modules/checkout-settings/repositories/checkout-general-settings.repository';
import { CheckoutGeneralSettingsService } from '../../modules/checkout-settings/services/checkout-general-settings.service';
import { SaveCheckoutGeneralSettingsDtoIn } from './dtos/save-checkout-general-settings.dto-in';
import { CheckoutGeneralSettingsDtoOut } from './dtos/checkout-general-settings.dto-out';
@Injectable()
export class SaveCheckoutGeneralSettingsUseCase {
  constructor(
    private readonly auth: GatewaySettingAuthorizationService,
    private readonly repository: CheckoutGeneralSettingsRepository,
  ) {}
  async exec(token: string, input: SaveCheckoutGeneralSettingsDtoIn) {
    const actor = await this.auth.exec(token, 'updateApiCredential');
    await this.auth.exec(token, 'activateApiCredential');
    const values = CheckoutGeneralSettingsService.validate({ ...input });
    return new CheckoutGeneralSettingsDtoOut(
      await this.repository.save(
        actor.officeId,
        actor.userCustomerId,
        input.version,
        values,
      ),
    );
  }
}
