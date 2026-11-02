import { CheckoutGeneralSettings } from '../../../modules/checkout-settings/entities/checkout-general-settings.entity';
export class CheckoutGeneralSettingsDtoOut {
  constructor(public readonly settings: CheckoutGeneralSettings) {}
}
