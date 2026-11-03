const map: Record<string, [string, string][]> = {
  'billing.read': [['billing','read']],
  'billing.create': [['billing','create']],
  'billing.issue': [['billing','issue'],['payment_transactions','processPayment']],
  'billing.receive': [['billing','receive']],
  'billing.cancel': [['billing','cancel']],
  'checkout.plans-list': [
    ['subscription_plans', 'listSubscriptionPlansByOfficeId'],
  ],
  'checkout.gateways.read': [['gateways', 'getAllGateways']],
  'checkout.credentials.read': [
    ['api_credentials', 'listApiCredentialByOfficeId'],
    ['api_credentials', 'getApiCredentialsByUniqueId'],
  ],
  'checkout.credentials.create': [['api_credentials', 'registerApiCredential']],
  'checkout.credentials.update': [['api_credentials', 'updateApiCredential']],
  'checkout.credentials.activate': [['api_credentials', 'updateApiCredential']],
  'checkout.credentials.verify': [
    ['api_credentials', 'getApiCredentialsByUniqueId'],
  ],
  'checkout.orders.read': [
    ['checkout_sessions', 'listCheckoutSessionsByOfficeId'],
    ['checkout_sessions', 'getCheckoutSessionByUniqueId'],
  ],
  'checkout.orders.export': [
    ['checkout_sessions', 'listCheckoutSessionsByOfficeId'],
  ],
  'customers.financial.read': [
    ['payment_customers', 'getPaymentCustomersByOfficeId'],
    ['subscriptions', 'listSubscriptionsByOfficeId'],
    ['subscription_invoices', 'listSubscriptionInvoicesByOfficeId'],
  ],
  'sales.cancellations-read': [
    ['checkout_sessions', 'getCheckoutSessionByUniqueId'],
  ],
  'sales.cancellations-refund': [['payment_refunds', 'refundOrderPayment']],
};
export function teamPermissions(slugs: string[]) {
  return slugs.flatMap((s) => map[s] ?? []);
}
