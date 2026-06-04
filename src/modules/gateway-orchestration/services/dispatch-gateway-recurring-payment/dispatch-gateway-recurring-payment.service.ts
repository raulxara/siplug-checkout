import { Injectable } from '@nestjs/common';
import { GatewayRecurringPaymentDtoIn } from '../../dtos/gateway-recurring-payment.dto-in';
import { GatewayRecurringPaymentDtoOut } from '../../dtos/gateway-recurring-payment.dto-out';
import { MercadoPagoRecurringPaymentProvider } from '../../providers/mercado-pago/mercado-pago-recurring-payment.provider';

@Injectable()
export class DispatchGatewayRecurringPaymentService {
  constructor(
    private readonly mercadoPagoRecurringPaymentProvider: MercadoPagoRecurringPaymentProvider,
  ) {}

  async exec(
    dtoIn: GatewayRecurringPaymentDtoIn,
  ): Promise<GatewayRecurringPaymentDtoOut> {
    const provider = this.normalizeProvider(dtoIn.gatewayProvider);

    if (provider === 'mercadopago' || provider === 'mercado_pago') {
      return await this.mercadoPagoRecurringPaymentProvider.createSubscription(
        dtoIn,
      );
    }

    if (provider === 'stripe') {
      return this.buildPendingProviderImplementation(dtoIn, 'stripe');
    }

    if (provider === 'paypal') {
      return this.buildPendingProviderImplementation(dtoIn, 'paypal');
    }

    if (provider === 'pagseguro' || provider === 'pagbank') {
      return this.buildPendingProviderImplementation(dtoIn, 'pagseguro');
    }

    if (provider === 'picpay') {
      return this.buildPendingProviderImplementation(dtoIn, 'picpay');
    }

    if (provider === 'infinitypay' || provider === 'infinitepay') {
      return this.buildPendingProviderImplementation(dtoIn, 'infinitypay');
    }

    return new GatewayRecurringPaymentDtoOut(
      false,
      dtoIn.gatewayProvider,

      null,
      null,
      null,
      null,

      'provider_not_supported',
      'failed',
      'gateway_recurring_provider_not_supported',
      `recurring payment provider not supported: ${dtoIn.gatewayProvider}`,

      this.sanitizePayload(dtoIn.providerPayload),
      null,
      {
        provider: dtoIn.gatewayProvider,
        reason: 'gateway_recurring_provider_not_supported',
      },
    );
  }

  private buildPendingProviderImplementation(
    dtoIn: GatewayRecurringPaymentDtoIn,
    normalizedProvider: string,
  ): GatewayRecurringPaymentDtoOut {
    return new GatewayRecurringPaymentDtoOut(
      false,
      normalizedProvider,

      null,
      this.extractGatewayPlanId(dtoIn, normalizedProvider),
      null,
      null,

      'recurring_provider_pending_implementation',
      'pending',
      'gateway_recurring_provider_pending_implementation',
      `recurring provider ${normalizedProvider} contract created. Provider API integration pending.`,

      this.sanitizePayload(dtoIn.providerPayload),
      {
        provider: normalizedProvider,
        subscriptionPlanId: dtoIn.subscriptionPlan._id,
        subscriptionId: dtoIn.subscription._id,
        subscriptionInvoiceId: dtoIn.subscriptionInvoice._id,
        paymentTransactionId: dtoIn.paymentTransaction._id,
      },
      {
        ok: false,
        provider: normalizedProvider,
        reason: 'gateway_recurring_provider_pending_implementation',
      },
      null,
      null,
    );
  }

  private extractGatewayPlanId(
    dtoIn: GatewayRecurringPaymentDtoIn,
    provider: string,
  ): string | null {
    const planConfig = this.asObject(dtoIn.subscriptionPlan.config);
    const gatewayMappings = this.asObject(planConfig.gatewayMappings);
    const providerMapping = this.asObject(gatewayMappings[provider]);

    return (
      this.toNullableString(providerMapping.gatewayPlanId) ??
      this.toNullableString(providerMapping.planId) ??
      this.toNullableString(providerMapping.priceId) ??
      dtoIn.subscriptionPlan.gatewayPlanId
    );
  }

  private sanitizePayload(
    payload: Record<string, unknown> | null,
  ): Record<string, unknown> | null {
    if (payload === null) {
      return null;
    }

    const sanitized = this.sanitizeUnknownValue(payload);

    if (!sanitized || typeof sanitized !== 'object' || Array.isArray(sanitized)) {
      return null;
    }

    return sanitized as Record<string, unknown>;
  }

  private sanitizeUnknownValue(value: unknown): unknown {
    if (Array.isArray(value)) {
      return value.map((item) => this.sanitizeUnknownValue(item));
    }

    if (value && typeof value === 'object') {
      const output: Record<string, unknown> = {};

      for (const [key, itemValue] of Object.entries(
        value as Record<string, unknown>,
      )) {
        if (this.isSensitiveKey(key)) {
          output[key] = '[REDACTED]';
          continue;
        }

        output[key] = this.sanitizeUnknownValue(itemValue);
      }

      return output;
    }

    return value;
  }

  private isSensitiveKey(key: string): boolean {
    const normalizedKey = key
      .toLowerCase()
      .trim()
      .replace(/[\s_\-]/g, '');

    const sensitiveKeys = [
      'token',
      'providertoken',
      'authorization',
      'accesstoken',
      'clientsecret',
      'merchantkey',
      'secret',
      'password',
      'card',
      'cardnumber',
      'cardtoken',
      'encryptedcard',
      'cvv',
      'securitycode',
      'pan',
      'rawcard',
    ];

    return sensitiveKeys.includes(normalizedKey);
  }

  private asObject(value: unknown): Record<string, unknown> {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
      return {};
    }

    return value as Record<string, unknown>;
  }

  private toNullableString(value: unknown): string | null {
    if (value === undefined || value === null) {
      return null;
    }

    const stringValue = String(value).trim();

    return stringValue === '' ? null : stringValue;
  }

  private normalizeProvider(provider: string): string {
    return provider
      .toLowerCase()
      .trim()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/-/g, '_')
      .replace(/\s+/g, '_');
  }
}