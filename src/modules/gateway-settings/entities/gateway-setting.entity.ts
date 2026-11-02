export type PaymentMode =
  | 'one_time'
  | 'recurring'
  | 'split'
  | 'split_recurring';
export type Environment = 'sandbox' | 'production';
export type SettingField = {
  key: string;
  label: string;
  secret: boolean;
  required: boolean;
};
export type GatewayDefinition = {
  provider: string;
  fields: SettingField[];
  modes: PaymentMode[];
  notice: string;
};
export type PublicGatewaySetting = {
  gatewayId: string;
  name: string;
  provider: string;
  definition: GatewayDefinition;
  supportedPaymentMethods: string[];
  credentials: Array<{
    id: string;
    environment: Environment;
    status: string;
    values: Record<string, string>;
    configuredSecrets: string[];
    modes: PaymentMode[];
    paymentMethods: string[];
    defaultModes: PaymentMode[];
    urls: Record<string, string>;
    version: string;
    connectionStatus: string;
  }>;
};
