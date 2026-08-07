import { Injectable } from '@nestjs/common';

import type { IGatewayPaymentProvider } from '../../contracts/gateway-payment-provider.interface';
import { GatewayPaymentDtoIn } from '../../dtos/gateway-payment.dto-in';
import { GatewayPaymentDtoOut } from '../../dtos/gateway-payment.dto-out';

type StripeCheckoutSessionResponse = {
  id?: string;
  object?: string;
  url?: string | null;
  status?: string | null;
  payment_status?: string | null;
  payment_intent?: string | null;
  client_reference_id?: string | null;
  currency?: string | null;
  amount_total?: number | null;
  expires_at?: number | null;
  created?: number | null;
  last_response?: unknown;
  error?: {
    type?: string;
    code?: string;
    message?: string;
    param?: string;
  };
  [key: string]: unknown;
};

@Injectable()
export class StripeGatewayPaymentProvider implements IGatewayPaymentProvider {
  getProviderName(): string {
    return 'stripe';
  }

  supports(gatewayProvider: string): boolean {
    const normalizedProvider = this.normalize(gatewayProvider);

    return ['stripe', 'stripe_checkout', 'stripe-checkout']
      .map((alias) => this.normalize(alias))
      .includes(normalizedProvider);
  }

  async processPayment(
    dtoIn: GatewayPaymentDtoIn,
  ): Promise<GatewayPaymentDtoOut> {
    try {
      if (
        !['payment_link', 'credit_card', 'pix', 'boleto'].includes(
          dtoIn.paymentTransaction.paymentMethod,
        )
      ) {
        return new GatewayPaymentDtoOut({
          success: false,
          provider: this.getProviderName(),

          gatewayTransactionId: null,
          gatewayStatus: null,

          status: 'failed',
          processStatus: 'gateway_payment_method_not_implemented',
          processMessage: `Stripe provider does not support payment method ${dtoIn.paymentTransaction.paymentMethod}`,

          providerRequest: {
            paymentTransactionId: dtoIn.paymentTransaction._id,
            paymentMethod: dtoIn.paymentTransaction.paymentMethod,
          },

          providerResponse: {
            message: 'payment method not implemented for Stripe adapter',
          },

          gatewayResponse: null,

          failedAt: this.nowAsSqlDateTime(),
          expiresAt: dtoIn.paymentTransaction.expiresAt,
        });
      }

      return await this.processCheckoutSession(dtoIn);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'error on Stripe payment provider';

      return new GatewayPaymentDtoOut({
        success: false,
        provider: this.getProviderName(),

        gatewayTransactionId: null,
        gatewayStatus: null,

        status: 'failed',
        processStatus: 'gateway_dispatch_exception',
        processMessage: message,

        providerRequest: {
          paymentTransactionId: dtoIn.paymentTransaction._id,
          idempotencyKey: dtoIn.idempotencyKey,
          providerPayload: dtoIn.providerPayload,
        },

        providerResponse: {
          message,
        },

        gatewayResponse: null,

        failedAt: this.nowAsSqlDateTime(),
        expiresAt: dtoIn.paymentTransaction.expiresAt,
      });
    }
  }

  private async processCheckoutSession(
    dtoIn: GatewayPaymentDtoIn,
  ): Promise<GatewayPaymentDtoOut> {
    const accessToken = this.resolveAccessToken(dtoIn);
    const baseUrl = this.resolveBaseUrl(dtoIn);
    const requestPayload = this.buildCheckoutSessionRequestPayload(dtoIn);

    const response = await fetch(`${baseUrl}/v1/checkout/sessions`, {
      method: 'POST',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/x-www-form-urlencoded',
        'Idempotency-Key': this.resolveIdempotencyKey(dtoIn),
      },
      body: new URLSearchParams(requestPayload).toString(),
    });

    const responseBody = (await response.json().catch(() => ({
      error: {
        message: 'Stripe returned a non JSON response',
      },
    }))) as StripeCheckoutSessionResponse;

    if (!response.ok) {
      return new GatewayPaymentDtoOut({
        success: false,
        provider: this.getProviderName(),

        gatewayTransactionId:
          this.toNullableString(responseBody.id) ??
          dtoIn.paymentTransaction.externalReference ??
          dtoIn.paymentTransaction._id,

        gatewayStatus:
          this.toNullableString(responseBody.status) ?? String(response.status),

        status: 'failed',
        processStatus: 'gateway_dispatch_failed',
        processMessage:
          this.extractStripeErrorMessage(responseBody) ??
          `Stripe Checkout Session request failed with status ${response.status}`,

        providerRequest: requestPayload,
        providerResponse: responseBody,
        gatewayResponse: {
          ok: false,
          httpStatus: response.status,
          endpoint: '/v1/checkout/sessions',
        },

        failedAt: this.nowAsSqlDateTime(),
        expiresAt: dtoIn.paymentTransaction.expiresAt,
      });
    }

    return this.mapSuccessfulCheckoutSessionResponse({
      dtoIn,
      requestPayload,
      responseBody,
      httpStatus: response.status,
    });
  }

  private buildCheckoutSessionRequestPayload(
    dtoIn: GatewayPaymentDtoIn,
  ): Record<string, string> {
    const config = dtoIn.config ?? {};
    const transactionConfig = this.asObject(config.transactionConfig);
    const gatewayConfig = this.asObject(config.gatewayConfig);
    const apiCredentialConfig = this.asObject(config.apiCredentialConfig);

    const providerPayload = dtoIn.providerPayload ?? {};
    const payerPayload = this.asObject(providerPayload.payer);

    const referenceId =
      dtoIn.paymentTransaction.externalReference ??
      dtoIn.paymentTransaction.idempotencyKey ??
      dtoIn.paymentTransaction._id;

    const payload: Record<string, string> = {
      mode: 'payment',
      client_reference_id: referenceId,
    };

    const successUrl =
      this.toNullableString(transactionConfig.successUrl) ??
      this.toNullableString(transactionConfig.success_url) ??
      this.toNullableString(gatewayConfig.successUrl) ??
      this.toNullableString(gatewayConfig.success_url) ??
      this.toNullableString(apiCredentialConfig.successUrl) ??
      this.toNullableString(apiCredentialConfig.success_url);

    if (successUrl === null) {
      throw new Error('Stripe successUrl is required in api credential config');
    }

    payload.success_url = successUrl;

    const cancelUrl =
      this.toNullableString(transactionConfig.cancelUrl) ??
      this.toNullableString(transactionConfig.cancel_url) ??
      this.toNullableString(gatewayConfig.cancelUrl) ??
      this.toNullableString(gatewayConfig.cancel_url) ??
      this.toNullableString(apiCredentialConfig.cancelUrl) ??
      this.toNullableString(apiCredentialConfig.cancel_url);

    if (cancelUrl !== null) {
      payload.cancel_url = cancelUrl;
    }

    const customerEmail = this.toNullableString(payerPayload.email);

    if (customerEmail !== null) {
      payload.customer_email = customerEmail;
    }

    const paymentMethodTypes = this.resolveStripePaymentMethodTypes(dtoIn);

    paymentMethodTypes.forEach((method, index) => {
      payload[`payment_method_types[${index}]`] = method;
    });

    const items = this.buildStripeLineItems(dtoIn);

    items.forEach((item, index) => {
      payload[`line_items[${index}][price_data][currency]`] = item.currency;
      payload[`line_items[${index}][price_data][product_data][name]`] =
        item.name;
      payload[`line_items[${index}][price_data][unit_amount]`] = String(
        item.unitAmount,
      );
      payload[`line_items[${index}][quantity]`] = String(item.quantity);

      if (item.referenceId !== null) {
        payload[
          `line_items[${index}][price_data][product_data][metadata][reference_id]`
        ] = item.referenceId;
      }
    });

    payload['metadata[paymentTransactionId]'] = dtoIn.paymentTransaction._id;
    payload['metadata[checkoutSessionId]'] =
      dtoIn.paymentTransaction.checkoutSessionId ?? '';
    payload['metadata[officeId]'] = dtoIn.paymentTransaction.officeId;
    payload['metadata[clientId]'] = dtoIn.paymentTransaction.clientId;
    payload['metadata[externalReference]'] = referenceId;

    payload['payment_intent_data[metadata][paymentTransactionId]'] =
      dtoIn.paymentTransaction._id;
    payload['payment_intent_data[metadata][checkoutSessionId]'] =
      dtoIn.paymentTransaction.checkoutSessionId ?? '';
    payload['payment_intent_data[metadata][officeId]'] =
      dtoIn.paymentTransaction.officeId;
    payload['payment_intent_data[metadata][clientId]'] =
      dtoIn.paymentTransaction.clientId;
    payload['payment_intent_data[metadata][externalReference]'] = referenceId;

    const boletoExpiresAfterDays =
      this.toPositiveInteger(transactionConfig.boletoExpiresAfterDays) ??
      this.toPositiveInteger(transactionConfig.boleto_expires_after_days) ??
      this.toPositiveInteger(gatewayConfig.boletoExpiresAfterDays) ??
      this.toPositiveInteger(apiCredentialConfig.boletoExpiresAfterDays);

    if (
      paymentMethodTypes.includes('boleto') &&
      boletoExpiresAfterDays !== null
    ) {
      payload['payment_method_options[boleto][expires_after_days]'] = String(
        boletoExpiresAfterDays,
      );
    }

    return payload;
  }

  private resolveStripePaymentMethodTypes(
    dtoIn: GatewayPaymentDtoIn,
  ): string[] {
    const config = dtoIn.config ?? {};
    const transactionConfig = this.asObject(config.transactionConfig);
    const apiCredentialConfig = this.asObject(config.apiCredentialConfig);

    if (dtoIn.paymentTransaction.paymentMethod === 'payment_link') {
      return ['card'];
    }

    if (dtoIn.paymentTransaction.paymentMethod === 'credit_card') {
      return ['card'];
    }

    if (dtoIn.paymentTransaction.paymentMethod === 'boleto') {
      return ['boleto'];
    }

    const configured =
      this.asStringArray(transactionConfig.stripePaymentMethods) ??
      this.asStringArray(transactionConfig.stripe_payment_methods) ??
      this.asStringArray(transactionConfig.allowedPaymentMethods) ??
      this.asStringArray(apiCredentialConfig.stripePaymentMethods) ??
      this.asStringArray(apiCredentialConfig.stripe_payment_methods);

    if (configured !== null) {
      return configured;
    }

    return ['card', 'boleto'];
  }

  private buildStripeLineItems(dtoIn: GatewayPaymentDtoIn): Array<{
    referenceId: string | null;
    name: string;
    quantity: number;
    unitAmount: number;
    currency: string;
  }> {
    const providerPayload = dtoIn.providerPayload ?? {};
    const rawItems = providerPayload.items;

    const currency = String(
      dtoIn.paymentTransaction.currency ?? 'BRL',
    ).toLowerCase();

    if (!Array.isArray(rawItems) || rawItems.length === 0) {
      return [
        {
          referenceId: dtoIn.paymentTransaction._id,
          name:
            dtoIn.paymentTransaction.externalReference ??
            `Pagamento ${dtoIn.paymentTransaction._id}`,
          quantity: 1,
          unitAmount: dtoIn.paymentTransaction.amount,
          currency,
        },
      ];
    }

    return rawItems
      .map((item) => this.asObject(item))
      .filter((item) => Object.keys(item).length > 0)
      .map((item) => {
        const quantity = this.toPositiveInteger(item.quantity) ?? 1;

        const unitAmount =
          this.toPositiveInteger(item.unitAmount) ??
          this.toPositiveInteger(item.unit_amount) ??
          this.toPositiveInteger(item.price) ??
          this.toPositiveInteger(item.totalAmount) ??
          this.toPositiveInteger(item.total_amount) ??
          dtoIn.paymentTransaction.amount;

        return {
          referenceId:
            this.toNullableString(item.itemRef) ??
            this.toNullableString(item.item_ref) ??
            this.toNullableString(item._id),
          name:
            this.toNullableString(item.name) ??
            this.toNullableString(item.description) ??
            `Item ${dtoIn.paymentTransaction._id}`,
          quantity,
          unitAmount,
          currency,
        };
      });
  }

  private mapSuccessfulCheckoutSessionResponse(params: {
    dtoIn: GatewayPaymentDtoIn;
    requestPayload: Record<string, string>;
    responseBody: StripeCheckoutSessionResponse;
    httpStatus: number;
  }): GatewayPaymentDtoOut {
    const gatewayStatus =
      this.toNullableString(params.responseBody.payment_status) ??
      this.toNullableString(params.responseBody.status) ??
      'created';

    const internalStatus = this.mapStripeStatusToInternalStatus(gatewayStatus);
    const processStatus = this.mapStripeStatusToProcessStatus(gatewayStatus);

    const checkoutUrl = this.toNullableString(params.responseBody.url);

    if (checkoutUrl === null) {
      return new GatewayPaymentDtoOut({
        success: false,
        provider: this.getProviderName(),

        gatewayTransactionId:
          this.toNullableString(params.responseBody.id) ??
          params.requestPayload.client_reference_id,

        gatewayStatus: 'missing_checkout_url',

        status: 'failed',
        processStatus: 'gateway_dispatch_failed',
        processMessage: 'Stripe did not return checkout url',

        providerRequest: params.requestPayload,
        providerResponse: params.responseBody,
        gatewayResponse: {
          ok: true,
          httpStatus: params.httpStatus,
          endpoint: '/v1/checkout/sessions',
          missingCheckoutUrl: true,
        },

        failedAt: this.nowAsSqlDateTime(),
        expiresAt: params.dtoIn.paymentTransaction.expiresAt,
      });
    }

    return new GatewayPaymentDtoOut({
      success: true,
      provider: this.getProviderName(),

      gatewayTransactionId:
        this.toNullableString(params.responseBody.id) ??
        params.requestPayload.client_reference_id,

      gatewayStatus,

      status: internalStatus,
      processStatus,
      processMessage: `Stripe Checkout Session returned status ${gatewayStatus}`,

      providerRequest: params.requestPayload,
      providerResponse: params.responseBody,
      gatewayResponse: {
        ok: true,
        httpStatus: params.httpStatus,
        endpoint: '/v1/checkout/sessions',
        checkoutSessionId: params.responseBody.id ?? null,
        paymentIntentId: params.responseBody.payment_intent ?? null,
        paymentStatus: params.responseBody.payment_status ?? null,
        sessionStatus: params.responseBody.status ?? null,
        checkoutUrl,
      },

      qrCode: null,
      qrCodeBase64: null,
      boletoUrl: null,
      checkoutUrl,

      paidAt: internalStatus === 'paid' ? this.nowAsSqlDateTime() : null,
      authorizedAt:
        internalStatus === 'authorized' ? this.nowAsSqlDateTime() : null,
      canceledAt:
        internalStatus === 'canceled' ? this.nowAsSqlDateTime() : null,
      failedAt: internalStatus === 'failed' ? this.nowAsSqlDateTime() : null,
      refundedAt:
        internalStatus === 'refunded' ? this.nowAsSqlDateTime() : null,

      expiresAt:
        this.formatUnixTimestampToSqlDateTime(params.responseBody.expires_at) ??
        params.dtoIn.paymentTransaction.expiresAt,
    });
  }

  private mapStripeStatusToInternalStatus(gatewayStatus: string): string {
    const status = this.normalize(gatewayStatus);

    if (['paid', 'complete', 'succeeded'].includes(status)) {
      return 'paid';
    }

    if (['requires_capture'].includes(status)) {
      return 'authorized';
    }

    if (
      [
        'unpaid',
        'open',
        'created',
        'pending',
        'requires_payment_method',
        'requires_confirmation',
        'requires_action',
        'processing',
      ].includes(status)
    ) {
      return 'pending';
    }

    if (['expired', 'canceled', 'cancelled'].includes(status)) {
      return 'canceled';
    }

    if (['failed'].includes(status)) {
      return 'failed';
    }

    if (['refunded'].includes(status)) {
      return 'refunded';
    }

    return 'processing';
  }

  private mapStripeStatusToProcessStatus(gatewayStatus: string): string {
    const status = this.normalize(gatewayStatus);

    if (['paid', 'complete', 'succeeded'].includes(status)) {
      return 'gateway_approved';
    }

    if (['requires_capture'].includes(status)) {
      return 'gateway_authorized';
    }

    if (
      [
        'unpaid',
        'open',
        'created',
        'pending',
        'requires_payment_method',
        'requires_confirmation',
        'requires_action',
        'processing',
      ].includes(status)
    ) {
      return 'gateway_pending';
    }

    if (['expired', 'canceled', 'cancelled'].includes(status)) {
      return 'gateway_cancelled';
    }

    if (['failed'].includes(status)) {
      return 'gateway_rejected';
    }

    if (['refunded'].includes(status)) {
      return 'gateway_refunded';
    }

    return 'gateway_dispatched';
  }

  private resolveAccessToken(dtoIn: GatewayPaymentDtoIn): string {
    const connectionData = dtoIn.apiCredential?.connectionData ?? {};
    const config = dtoIn.apiCredential?.config ?? {};

    const candidates = [
      dtoIn.apiCredential?.token,

      connectionData.token,
      connectionData.accessToken,
      connectionData.access_token,
      connectionData.providerToken,
      connectionData.provider_token,

      config.accessToken,
      config.access_token,
      config.providerToken,
      config.provider_token,
    ];

    const token = candidates.find(
      (value) => typeof value === 'string' && value.trim() !== '',
    );

    if (typeof token !== 'string') {
      throw new Error('Stripe secret key is required in api credential token');
    }

    return token;
  }

  private resolveBaseUrl(dtoIn: GatewayPaymentDtoIn): string {
    const config = dtoIn.config ?? {};
    const transactionConfig = this.asObject(config.transactionConfig);
    const gatewayConfig = this.asObject(config.gatewayConfig);
    const apiCredentialConfig = this.asObject(config.apiCredentialConfig);

    const baseUrl =
      this.toNullableString(transactionConfig.baseUrl) ??
      this.toNullableString(transactionConfig.base_url) ??
      this.toNullableString(gatewayConfig.baseUrl) ??
      this.toNullableString(gatewayConfig.base_url) ??
      this.toNullableString(apiCredentialConfig.baseUrl) ??
      this.toNullableString(apiCredentialConfig.base_url);

    return baseUrl ?? 'https://api.stripe.com';
  }

  private resolveIdempotencyKey(dtoIn: GatewayPaymentDtoIn): string {
    return (
      dtoIn.idempotencyKey ??
      dtoIn.paymentTransaction.idempotencyKey ??
      dtoIn.paymentTransaction._id
    );
  }

  private extractStripeErrorMessage(
    responseBody: StripeCheckoutSessionResponse,
  ): string | null {
    return (
      this.toNullableString(responseBody.error?.message) ??
      this.toNullableString(responseBody.error?.code)
    );
  }

  private formatUnixTimestampToSqlDateTime(value: unknown): string | null {
    if (typeof value !== 'number' || !Number.isFinite(value)) {
      return null;
    }

    return this.formatDateToSqlDateTime(new Date(value * 1000));
  }

  private asStringArray(value: unknown): string[] | null {
    if (!Array.isArray(value)) {
      return null;
    }

    const items = value
      .map((item) => this.toNullableString(item))
      .filter((item): item is string => item !== null);

    return items.length > 0 ? items : null;
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

    if (
      typeof value !== 'string' &&
      typeof value !== 'number' &&
      typeof value !== 'boolean'
    ) {
      return null;
    }

    const stringValue = String(value).trim();

    return stringValue === '' ? null : stringValue;
  }

  private toPositiveInteger(value: unknown): number | null {
    if (typeof value === 'number' && Number.isInteger(value) && value > 0) {
      return value;
    }

    if (typeof value === 'string' && value.trim() !== '') {
      const parsed = Number(value);

      if (Number.isInteger(parsed) && parsed > 0) {
        return parsed;
      }
    }

    return null;
  }

  private nowAsSqlDateTime(): string {
    return this.formatDateToSqlDateTime(new Date());
  }

  private formatDateToSqlDateTime(date: Date): string {
    const year = date.getFullYear();
    const month = this.pad(date.getMonth() + 1);
    const day = this.pad(date.getDate());
    const hours = this.pad(date.getHours());
    const minutes = this.pad(date.getMinutes());
    const seconds = this.pad(date.getSeconds());

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

  private pad(value: number): string {
    return String(value).padStart(2, '0');
  }

  private normalize(value: string): string {
    return value
      .toLowerCase()
      .trim()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\./g, '')
      .replace(/-/g, '_')
      .replace(/\s+/g, '_');
  }
}
