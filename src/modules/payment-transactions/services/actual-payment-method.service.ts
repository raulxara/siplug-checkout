/** Extracts only a selected instrument from authenticated gateway evidence.
 * Never uses lists of allowed instruments, card brands, or merchant input.
 */
export class ActualPaymentMethodService {
  static resolve(provider: string, payload: unknown): string | null {
    const get = (value: unknown, path: string): unknown =>
      path
        .split('.')
        .reduce<unknown>(
          (v, k) =>
            v !== null && typeof v === 'object'
              ? (v as Record<string, unknown>)[k]
              : undefined,
          value,
        );
    const first = (paths: string[]) =>
      paths
        .map((p) => get(payload, p))
        .find((v) => typeof v === 'string' && v.trim());
    let raw: unknown;
    switch (provider.toLowerCase().replace(/-/g, '_')) {
      case 'mercadopago':
      case 'mercado_pago':
        if (first(['payment.payment_method_id', 'payment_method_id']) === 'pix')
          return 'pix';
        raw = first(['payment.payment_type_id', 'payment_type_id']);
        break;
      case 'stripe':
        raw = first([
          'data.object.payment_method_details.type',
          'data.object.latest_charge.payment_method_details.type',
          'data.object.charges.data.0.payment_method_details.type',
          'payment_method_details.type',
          'latest_charge.payment_method_details.type',
          'charges.data.0.payment_method_details.type',
        ]);
        break;
      case 'pagbank':
      case 'pagseguro':
        raw = first([
          'pagseguro.charges.0.payment_method.type',
          'pagseguro.payment_method.type',
          'charges.0.payment_method.type',
          'payment_method.type',
        ]);
        break;
      case 'picpay':
        raw = first([
          'picpay.data.transactions.0.paymentType',
          'picpay.transactions.0.paymentType',
          'picpay.data.paymentType',
          'picpay.paymentType',
        ]);
        break;
      case 'infinitepay':
      case 'infinity_pay':
        raw = first([
          'data.payment_method',
          'data.paymentMethod',
          'payload.payment_method',
          'resource.payment_method',
          'event.payment_method',
          'payment_method',
          'paymentMethod',
        ]);
        break;
      case 'paypal': {
        const source =
          get(payload, 'resource.payment_source') ??
          get(payload, 'payment_source');
        if (source && typeof source === 'object') {
          const keys = Object.keys(source).filter((k) =>
            ['card', 'paypal', 'venmo'].includes(k),
          );
          if (keys.length === 1) raw = keys[0];
        }
        break;
      }
    }
    if (typeof raw !== 'string') return null;
    const methods: Record<string, string> = {
      credit_card: 'credit_card',
      credit: 'credit_card',
      debit_card: 'debit_card',
      debit: 'debit_card',
      card: 'card',
      pix: 'pix',
      boleto: 'boleto',
      ticket: 'boleto',
      bank_slip: 'boleto',
      bank_transfer: 'bank_transfer',
      account_money: 'wallet',
      wallet: 'wallet',
      paypal: 'paypal',
      venmo: 'venmo',
      picpay: 'wallet',
    };
    return methods[raw.trim().toLowerCase()] ?? null;
  }
  static merge(
    config: Record<string, unknown> | null,
    provider: string,
    payload: unknown,
  ): Record<string, unknown> | undefined {
    const actualPaymentMethod = this.resolve(provider, payload);
    return actualPaymentMethod ? { ...config, actualPaymentMethod } : undefined;
  }
}
