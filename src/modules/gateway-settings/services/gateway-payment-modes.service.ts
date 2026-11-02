import { PaymentMode } from '../entities/gateway-setting.entity';

// Credential preferences, independent of the gateway catalog capabilities.
export class GatewayPaymentModesService {
  private static readonly fields: Record<PaymentMode, string> = {
    one_time: 'supportsOneTimePayment',
    recurring: 'supportsRecurringPayment',
    split: 'supportsSplitPayment',
    split_recurring: 'supportsSplitRecurringPayment',
  };

  static flags(modes: PaymentMode[]): Record<string, boolean> {
    return Object.fromEntries(
      Object.entries(this.fields).map(([mode, field]) => [
        field,
        modes.includes(mode as PaymentMode),
      ]),
    );
  }

  static enabled(config: Record<string, unknown>): PaymentMode[] {
    return (Object.keys(this.fields) as PaymentMode[]).filter((mode) => {
      const field = this.fields[mode];
      // Explicit flags take precedence; only older missing fields use the list.
      if (Object.prototype.hasOwnProperty.call(config, field))
        return config[field] === true;
      return (
        Array.isArray(config.enabledModes) && config.enabledModes.includes(mode)
      );
    });
  }
}
