import { BadRequestException } from '@nestjs/common';
import { isIP } from 'node:net';
import { CheckoutGeneralSettings } from '../entities/checkout-general-settings.entity';

export class CheckoutGeneralSettingsService {
  static url(value: unknown): string {
    if (
      typeof value !== 'string' ||
      value.length > 2048 ||
      /[\r\n\\]/.test(value)
    )
      throw new BadRequestException('Endereço de retorno inválido.');
    let url: URL;
    try {
      url = new URL(value);
    } catch {
      throw new BadRequestException('Endereço de retorno inválido.');
    }
    const local =
      process.env.NODE_ENV !== 'production' &&
      ['localhost', '127.0.0.1'].includes(url.hostname) &&
      url.origin ===
        new URL(process.env.CHECKOUT_FRONTEND_URL || 'https://invalid.test')
          .origin;
    if (
      url.username ||
      url.password ||
      url.hash ||
      url.search ||
      (!local &&
        (url.protocol !== 'https:' ||
          isIP(url.hostname.replace(/[\[\]]/g, '')) ||
          !url.hostname.includes('.') ||
          /\.(local|internal|localhost)$/.test(url.hostname))) ||
      (local && !['https:', 'http:'].includes(url.protocol))
    )
      throw new BadRequestException(
        'Use uma URL HTTPS pública, sem credenciais, parâmetros ou fragmentos.',
      );
    return url.toString();
  }

  static paypalCaptureUrl(id: string): string {
    let root: URL;
    try {
      root = new URL(process.env.CHECKOUT_PUBLIC_URL ?? '');
    } catch {
      throw new BadRequestException('URL pública do Checkout inválida.');
    }
    const local =
      process.env.NODE_ENV !== 'production' &&
      ['localhost', '127.0.0.1'].includes(root.hostname);
    if (
      root.username ||
      root.password ||
      root.search ||
      root.hash ||
      root.pathname !== '/' ||
      (root.protocol !== 'https:' && !(local && root.protocol === 'http:')) ||
      !/^[a-f0-9-]{36}$/i.test(id)
    )
      throw new BadRequestException('URL pública do Checkout inválida.');
    return `${root.origin}/api/v1/paypal/checkout/return/${id}`;
  }

  static validate(input: Record<string, unknown>) {
    if (
      input.currency !== 'BRL' ||
      !['sandbox', 'production'].includes(String(input.environment)) ||
      !Number.isInteger(input.sessionDurationMinutes) ||
      Number(input.sessionDurationMinutes) < 30 ||
      Number(input.sessionDurationMinutes) > 1440
    )
      throw new BadRequestException('Configurações gerais inválidas.');
    return {
      currency: 'BRL' as const,
      environment: input.environment as 'sandbox' | 'production',
      successUrl: this.url(input.successUrl),
      cancelUrl: this.url(input.cancelUrl),
      sessionDurationMinutes: Number(input.sessionDurationMinutes),
      paymentMethod: 'payment_link' as const,
    };
  }

  static read(config: unknown): CheckoutGeneralSettings {
    const stored = (config as Record<string, unknown> | null)
      ?.checkoutSettings as Record<string, unknown> | undefined;
    if (stored)
      return {
        ...this.validate(stored),
        version: String(stored.version),
        configured: true,
      };
    const front = process.env.CHECKOUT_FRONTEND_URL ?? '';
    return {
      currency: 'BRL',
      environment: 'sandbox',
      successUrl: this.url(front + '/pagamento/retorno'),
      cancelUrl: this.url(front + '/pagamento/cancelado'),
      sessionDurationMinutes: 60,
      paymentMethod: 'payment_link',
      version: 'initial',
      configured: false,
    };
  }

  static apply(
    config: unknown,
    input: {
      config: Record<string, unknown> | null;
      currency: string;
      successUrl: string | null;
      cancelUrl: string | null;
      expiresAt: string | null;
    },
  ) {
    if (!(config as Record<string, unknown> | null)?.checkoutSettings) {
      const safeConfig = { ...(input.config ?? {}) };
      delete safeConfig.checkoutSettingsSnapshot;
      return { ...input, config: safeConfig };
    }
    const settings = this.read(config);
    const expiresAt = new Date(
      Date.now() + settings.sessionDurationMinutes * 60000,
    ).toISOString();
    return {
      currency: settings.currency,
      successUrl: settings.successUrl,
      cancelUrl: settings.cancelUrl,
      expiresAt,
      config: {
        ...(input.config ?? {}),
        ...this.snapshot(settings, expiresAt),
      },
    };
  }

  private static snapshot(
    settings: CheckoutGeneralSettings,
    expiresAt: string,
  ) {
    return {
      environment: settings.environment,
      paymentMethod: 'payment_link',
      paymentFlow: 'hosted_checkout',
      successUrl: settings.successUrl,
      cancelUrl: settings.cancelUrl,
      redirectUrl: settings.successUrl,
      backUrl: settings.successUrl,
      checkoutSettingsSnapshot: {
        currency: settings.currency,
        environment: settings.environment,
        successUrl: settings.successUrl,
        cancelUrl: settings.cancelUrl,
        expiresAt,
        version: settings.version,
      },
    };
  }

  static assertAvailable(
    session: {
      expiresAt: string | null;
      config: Record<string, unknown> | null;
    },
    paymentMethod: string,
  ) {
    const snapshot = session.config?.checkoutSettingsSnapshot as
      | Record<string, unknown>
      | undefined;
    if (snapshot && paymentMethod !== 'payment_link')
      throw new BadRequestException('Este checkout exige link de pagamento.');
    const expiresAt = snapshot?.expiresAt ?? session.expiresAt;
    if (
      expiresAt &&
      (!Number.isFinite(new Date(String(expiresAt)).getTime()) ||
        new Date(String(expiresAt)).getTime() <= Date.now())
    )
      throw new BadRequestException('Sessão de checkout expirada.');
  }

  static transactionConfig(
    sessionConfig: Record<string, unknown> | null,
    requestConfig: Record<string, unknown> | null,
  ) {
    const result = { ...(sessionConfig ?? {}), ...(requestConfig ?? {}) };
    const snapshot = sessionConfig?.checkoutSettingsSnapshot as
      | Record<string, unknown>
      | undefined;
    if (snapshot) {
      // Preserve the server-owned snapshot and URLs even if a payment request supplies overrides.
      for (const key of [
        'returnUrl',
        'return_url',
        'success_url',
        'cancel_url',
        'redirect_url',
        'back_url',
      ])
        delete result[key];
      Object.assign(result, {
        environment: snapshot.environment,
        paymentMethod: 'payment_link',
        paymentFlow: 'hosted_checkout',
        successUrl: snapshot.successUrl,
        cancelUrl: snapshot.cancelUrl,
        redirectUrl: snapshot.successUrl,
        backUrl: snapshot.successUrl,
        checkoutSettingsSnapshot: snapshot,
      });
    }
    return result;
  }
}
