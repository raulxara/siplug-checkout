export type CheckoutGeneralSettings = {
  currency: 'BRL';
  environment: 'sandbox' | 'production';
  successUrl: string;
  cancelUrl: string;
  sessionDurationMinutes: number;
  paymentMethod: 'payment_link';
  version: string;
  configured: boolean;
};
