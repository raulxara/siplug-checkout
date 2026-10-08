import { BadRequestException } from '@nestjs/common';

export class GatewayPaymentMethodsService {
  static supported(config: unknown): string[] {
    const c = (config ?? {}) as Record<string, unknown>;
    const methods = c.supportedPaymentMethods ?? c.supported_payment_methods;
    return Array.isArray(methods)
      ? [
          ...new Set(
            methods.filter(
              (m): m is string =>
                typeof m === 'string' && /^[a-z][a-z0-9_]{0,63}$/.test(m),
            ),
          ),
        ].slice(0, 32)
      : [];
  }

  static selected(gatewayConfig: unknown, credentialConfig: unknown): string[] {
    const c = (credentialConfig ?? {}) as Record<string, unknown>;
    const supported = this.supported(gatewayConfig);
    return [
      'payment_link',
      ...supported.filter(
        (m) =>
          m !== 'payment_link' &&
          Array.isArray(c.paymentMethods) &&
          c.paymentMethods.includes(m),
      ),
    ];
  }

  static forSave(
    gatewayConfig: unknown,
    input: unknown,
    previous: unknown,
  ): string[] {
    // Older clients may omit this field; keep their existing supported selections.
    if (input === undefined) return this.selected(gatewayConfig, previous);
    const supported = this.supported(gatewayConfig);
    if (
      !Array.isArray(input) ||
      input.length > 32 ||
      input.some(
        (m) =>
          typeof m !== 'string' ||
          (m !== 'payment_link' && !supported.includes(m)),
      )
    )
      throw new BadRequestException(
        'Selecione métodos de pagamento disponíveis neste gateway.',
      );
    return this.selected(gatewayConfig, { paymentMethods: input });
  }
}
