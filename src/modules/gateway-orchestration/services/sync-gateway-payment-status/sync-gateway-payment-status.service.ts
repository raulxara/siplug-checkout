import { Injectable } from '@nestjs/common';
import { GatewayPaymentStatusDtoIn } from '../../dtos/gateway-payment-status.dto-in';
import { GatewayPaymentStatusDtoOut } from '../../dtos/gateway-payment-status.dto-out';

type NormalizedGatewayStatus = {
  gatewayStatus: string;
  status: string;
  processStatus: string;
  processMessage: string;
  paidAt?: string | null;
  authorizedAt?: string | null;
  canceledAt?: string | null;
  failedAt?: string | null;
  refundedAt?: string | null;
  expiresAt?: string | null;
};

@Injectable()
export class SyncGatewayPaymentStatusService {
  async exec(
    dtoIn: GatewayPaymentStatusDtoIn,
  ): Promise<GatewayPaymentStatusDtoOut> {
    const normalizedProvider = this.normalize(dtoIn.gatewayProvider);

    if (
      normalizedProvider === 'mercado_pago' ||
      normalizedProvider === 'mercadopago'
    ) {
      return await this.syncMercadoPago(dtoIn);
    }

    if (normalizedProvider === 'stripe') {
      return await this.syncStripe(dtoIn);
    }

    if (normalizedProvider === 'paypal') {
      return await this.syncPayPal(dtoIn);
    }

    if (
      normalizedProvider === 'pagseguro' ||
      normalizedProvider === 'pagbank'
    ) {
      return await this.syncPagSeguro(dtoIn);
    }

    return this.buildUnsupportedSyncResponse(dtoIn);
  }

  private async syncMercadoPago(
    dtoIn: GatewayPaymentStatusDtoIn,
  ): Promise<GatewayPaymentStatusDtoOut> {
    const gatewayTransactionId = this.requireGatewayTransactionId(dtoIn);
    const token = this.requireProviderToken(
      dtoIn,
      'Mercado Pago token is required',
    );
    const baseUrl = this.resolveBaseUrl(dtoIn, 'https://api.mercadopago.com');

    const endpoint = `/v1/payments/${gatewayTransactionId}`;

    const response = await fetch(`${baseUrl}${endpoint}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    const responseBody = await this.parseJsonResponse(
      response,
      'Mercado Pago returned a non JSON status response',
    );

    if (!response.ok) {
      return this.buildFailedGatewayResponse({
        dtoIn,
        endpoint,
        httpStatus: response.status,
        providerResponse: responseBody,
        processMessage:
          this.toNullableString(responseBody.message) ??
          `Mercado Pago status request failed with status ${response.status}`,
      });
    }

    const gatewayStatus =
      this.toNullableString(responseBody.status) ??
      this.toNullableString(responseBody.status_detail) ??
      'unknown';

    const mappedStatus = this.mapMercadoPagoStatus(gatewayStatus, responseBody);

    return this.buildSuccessGatewayResponse({
      dtoIn,
      endpoint,
      httpStatus: response.status,
      providerResponse: responseBody,
      mappedStatus,
    });
  }

  private async syncStripe(
    dtoIn: GatewayPaymentStatusDtoIn,
  ): Promise<GatewayPaymentStatusDtoOut> {
    const gatewayTransactionId = this.requireGatewayTransactionId(dtoIn);
    const token = this.requireProviderToken(dtoIn, 'Stripe token is required');
    const baseUrl = this.resolveBaseUrl(dtoIn, 'https://api.stripe.com');

    const endpoint = gatewayTransactionId.startsWith('pi_')
      ? `/v1/payment_intents/${gatewayTransactionId}`
      : `/v1/checkout/sessions/${gatewayTransactionId}`;

    const response = await fetch(`${baseUrl}${endpoint}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    const responseBody = await this.parseJsonResponse(
      response,
      'Stripe returned a non JSON status response',
    );

    if (!response.ok) {
      return this.buildFailedGatewayResponse({
        dtoIn,
        endpoint,
        httpStatus: response.status,
        providerResponse: responseBody,
        processMessage:
          this.toNullableString(responseBody.error) ??
          this.toNullableString(this.asObject(responseBody.error).message) ??
          `Stripe status request failed with status ${response.status}`,
      });
    }

    const gatewayStatus =
      this.toNullableString(responseBody.payment_status) ??
      this.toNullableString(responseBody.status) ??
      'unknown';

    const mappedStatus = this.mapStripeStatus({
      gatewayStatus,
      responseBody,
      isPaymentIntent: gatewayTransactionId.startsWith('pi_'),
    });

    return this.buildSuccessGatewayResponse({
      dtoIn,
      endpoint,
      httpStatus: response.status,
      providerResponse: responseBody,
      mappedStatus,
    });
  }

  private async syncPayPal(
    dtoIn: GatewayPaymentStatusDtoIn,
  ): Promise<GatewayPaymentStatusDtoOut> {
    const gatewayTransactionId = this.requireGatewayTransactionId(dtoIn);
    const baseUrl = this.resolveBaseUrl(
      dtoIn,
      'https://api-m.sandbox.paypal.com',
    );
    const accessToken = await this.createPayPalAccessToken(dtoIn, baseUrl);

    const endpoint = `/v2/checkout/orders/${gatewayTransactionId}`;

    const response = await fetch(`${baseUrl}${endpoint}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const responseBody = await this.parseJsonResponse(
      response,
      'PayPal returned a non JSON status response',
    );

    if (!response.ok) {
      return this.buildFailedGatewayResponse({
        dtoIn,
        endpoint,
        httpStatus: response.status,
        providerResponse: responseBody,
        processMessage:
          this.toNullableString(responseBody.message) ??
          this.toNullableString(responseBody.name) ??
          `PayPal status request failed with status ${response.status}`,
      });
    }

    const gatewayStatus =
      this.toNullableString(responseBody.status) ?? 'unknown';
    const mappedStatus = this.mapPayPalStatus(gatewayStatus);

    return this.buildSuccessGatewayResponse({
      dtoIn,
      endpoint,
      httpStatus: response.status,
      providerResponse: responseBody,
      mappedStatus,
    });
  }

  private async syncPagSeguro(
    dtoIn: GatewayPaymentStatusDtoIn,
  ): Promise<GatewayPaymentStatusDtoOut> {
    const gatewayTransactionId = this.requireGatewayTransactionId(dtoIn);
    const token = this.requireProviderToken(
      dtoIn,
      'PagSeguro token is required',
    );
    const baseUrl = this.resolveBaseUrl(
      dtoIn,
      'https://sandbox.api.pagseguro.com',
    );

    const endpoint = `/orders/${gatewayTransactionId}`;

    const response = await fetch(`${baseUrl}${endpoint}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    const responseBody = await this.parseJsonResponse(
      response,
      'PagSeguro returned a non JSON status response',
    );

    if (!response.ok) {
      return this.buildFailedGatewayResponse({
        dtoIn,
        endpoint,
        httpStatus: response.status,
        providerResponse: responseBody,
        processMessage:
          this.toNullableString(responseBody.message) ??
          this.toNullableString(responseBody.error) ??
          `PagSeguro status request failed with status ${response.status}`,
      });
    }

    const charges = Array.isArray(responseBody.charges)
      ? responseBody.charges
      : [];

    const firstCharge = charges.length > 0 ? this.asObject(charges[0]) : {};

    const gatewayStatus =
      this.toNullableString(firstCharge.status) ??
      this.toNullableString(responseBody.status) ??
      'unknown';

    const mappedStatus = this.mapPagSeguroStatus(gatewayStatus);

    return this.buildSuccessGatewayResponse({
      dtoIn,
      endpoint,
      httpStatus: response.status,
      providerResponse: responseBody,
      mappedStatus,
    });
  }

  private async createPayPalAccessToken(
    dtoIn: GatewayPaymentStatusDtoIn,
    baseUrl: string,
  ): Promise<string> {
    const apiCredentialConfig = this.asObject(dtoIn.config.apiCredentialConfig);
    const credentialConfig = this.asObject(dtoIn.apiCredential?.config);
    const connectionData = this.asObject(dtoIn.apiCredential?.connectionData);

    const clientId =
      this.toNullableString(apiCredentialConfig.clientId) ??
      this.toNullableString(apiCredentialConfig.client_id) ??
      this.toNullableString(credentialConfig.clientId) ??
      this.toNullableString(credentialConfig.client_id) ??
      this.toNullableString(connectionData.clientId) ??
      this.toNullableString(connectionData.client_id);

    const clientSecret =
      this.toNullableString(dtoIn.apiCredential?.token) ??
      this.toNullableString(connectionData.token) ??
      this.toNullableString(connectionData.clientSecret) ??
      this.toNullableString(connectionData.client_secret);

    if (clientId === null) {
      throw new Error('PayPal clientId is required');
    }

    if (clientSecret === null) {
      throw new Error('PayPal clientSecret is required');
    }

    const basicToken = Buffer.from(`${clientId}:${clientSecret}`).toString(
      'base64',
    );

    const response = await fetch(`${baseUrl}/v1/oauth2/token`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Accept-Language': 'en_US',
        Authorization: `Basic ${basicToken}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    });

    const responseBody = await this.parseJsonResponse(
      response,
      'PayPal returned a non JSON token response',
    );

    if (!response.ok) {
      throw new Error(
        this.toNullableString(responseBody.error_description) ??
          this.toNullableString(responseBody.error) ??
          `PayPal token request failed with status ${response.status}`,
      );
    }

    const accessToken = this.toNullableString(responseBody.access_token);

    if (accessToken === null) {
      throw new Error('PayPal access token was not returned');
    }

    return accessToken;
  }

  private buildUnsupportedSyncResponse(
    dtoIn: GatewayPaymentStatusDtoIn,
  ): GatewayPaymentStatusDtoOut {
    return new GatewayPaymentStatusDtoOut(
      false,
      dtoIn.gatewayProvider,
      dtoIn.paymentTransaction.gatewayTransactionId,
      dtoIn.paymentTransaction.gatewayStatus,
      dtoIn.paymentTransaction.status,
      'sync_not_available',
      `payment status sync is not available for gateway provider ${dtoIn.gatewayProvider}`,
      {
        gatewayProvider: dtoIn.gatewayProvider,
        gatewayTransactionId: dtoIn.paymentTransaction.gatewayTransactionId,
      },
      null,
      {
        ok: false,
        provider: dtoIn.gatewayProvider,
        reason: 'sync_not_available',
      },
      dtoIn.paymentTransaction.qrCode,
      dtoIn.paymentTransaction.qrCodeBase64,
      dtoIn.paymentTransaction.boletoUrl,
      dtoIn.paymentTransaction.checkoutUrl,
      dtoIn.paymentTransaction.paidAt,
      dtoIn.paymentTransaction.authorizedAt,
      dtoIn.paymentTransaction.canceledAt,
      dtoIn.paymentTransaction.failedAt,
      dtoIn.paymentTransaction.refundedAt,
      dtoIn.paymentTransaction.expiresAt,
    );
  }

  private buildFailedGatewayResponse(params: {
    dtoIn: GatewayPaymentStatusDtoIn;
    endpoint: string;
    httpStatus: number;
    providerResponse: Record<string, unknown>;
    processMessage: string;
  }): GatewayPaymentStatusDtoOut {
    return new GatewayPaymentStatusDtoOut(
      false,
      params.dtoIn.gatewayProvider,
      params.dtoIn.paymentTransaction.gatewayTransactionId,
      String(params.httpStatus),
      params.dtoIn.paymentTransaction.status,
      'sync_failed',
      params.processMessage,
      {
        gatewayProvider: params.dtoIn.gatewayProvider,
        gatewayTransactionId:
          params.dtoIn.paymentTransaction.gatewayTransactionId,
        endpoint: params.endpoint,
      },
      params.providerResponse,
      {
        ok: false,
        endpoint: params.endpoint,
        httpStatus: params.httpStatus,
      },
      params.dtoIn.paymentTransaction.qrCode,
      params.dtoIn.paymentTransaction.qrCodeBase64,
      params.dtoIn.paymentTransaction.boletoUrl,
      params.dtoIn.paymentTransaction.checkoutUrl,
      params.dtoIn.paymentTransaction.paidAt,
      params.dtoIn.paymentTransaction.authorizedAt,
      params.dtoIn.paymentTransaction.canceledAt,
      params.dtoIn.paymentTransaction.failedAt,
      params.dtoIn.paymentTransaction.refundedAt,
      params.dtoIn.paymentTransaction.expiresAt,
    );
  }

  private buildSuccessGatewayResponse(params: {
    dtoIn: GatewayPaymentStatusDtoIn;
    endpoint: string;
    httpStatus: number;
    providerResponse: Record<string, unknown>;
    mappedStatus: NormalizedGatewayStatus;
  }): GatewayPaymentStatusDtoOut {
    return new GatewayPaymentStatusDtoOut(
      true,
      params.dtoIn.gatewayProvider,
      params.dtoIn.paymentTransaction.gatewayTransactionId,
      params.mappedStatus.gatewayStatus,
      params.mappedStatus.status,
      params.mappedStatus.processStatus,
      params.mappedStatus.processMessage,
      {
        gatewayProvider: params.dtoIn.gatewayProvider,
        gatewayTransactionId:
          params.dtoIn.paymentTransaction.gatewayTransactionId,
        endpoint: params.endpoint,
      },
      params.providerResponse,
      {
        ok: true,
        endpoint: params.endpoint,
        httpStatus: params.httpStatus,
      },
      params.dtoIn.paymentTransaction.qrCode,
      params.dtoIn.paymentTransaction.qrCodeBase64,
      params.dtoIn.paymentTransaction.boletoUrl,
      params.dtoIn.paymentTransaction.checkoutUrl,
      params.mappedStatus.paidAt ?? null,
      params.mappedStatus.authorizedAt ?? null,
      params.mappedStatus.canceledAt ?? null,
      params.mappedStatus.failedAt ?? null,
      params.mappedStatus.refundedAt ?? null,
      params.mappedStatus.expiresAt ??
        params.dtoIn.paymentTransaction.expiresAt,
    );
  }

  private mapMercadoPagoStatus(
    gatewayStatus: string,
    responseBody: Record<string, unknown>,
  ): NormalizedGatewayStatus {
    const status = this.normalize(gatewayStatus);
    const now = this.nowAsSqlDateTime();

    if (status === 'approved') {
      return {
        gatewayStatus,
        status: 'paid',
        processStatus: 'sync_completed',
        processMessage: 'Mercado Pago payment approved',
        paidAt: this.toNullableString(responseBody.date_approved) ?? now,
      };
    }

    if (status === 'authorized') {
      return {
        gatewayStatus,
        status: 'authorized',
        processStatus: 'sync_completed',
        processMessage: 'Mercado Pago payment authorized',
        authorizedAt: now,
      };
    }

    if (['pending', 'in_process', 'in_mediation'].includes(status)) {
      return {
        gatewayStatus,
        status: 'pending',
        processStatus: 'sync_completed',
        processMessage: `Mercado Pago payment is ${gatewayStatus}`,
      };
    }

    if (['cancelled', 'canceled'].includes(status)) {
      return {
        gatewayStatus,
        status: 'canceled',
        processStatus: 'sync_completed',
        processMessage: 'Mercado Pago payment canceled',
        canceledAt: now,
      };
    }

    if (['refunded', 'charged_back'].includes(status)) {
      return {
        gatewayStatus,
        status: 'refunded',
        processStatus: 'sync_completed',
        processMessage: `Mercado Pago payment is ${gatewayStatus}`,
        refundedAt: now,
      };
    }

    if (status === 'rejected') {
      return {
        gatewayStatus,
        status: 'failed',
        processStatus: 'sync_completed',
        processMessage: 'Mercado Pago payment rejected',
        failedAt: now,
      };
    }

    return {
      gatewayStatus,
      status: 'processing',
      processStatus: 'sync_completed',
      processMessage: `Mercado Pago payment status synchronized: ${gatewayStatus}`,
    };
  }

  private mapStripeStatus(params: {
    gatewayStatus: string;
    responseBody: Record<string, unknown>;
    isPaymentIntent: boolean;
  }): NormalizedGatewayStatus {
    const status = this.normalize(params.gatewayStatus);
    const now = this.nowAsSqlDateTime();

    if (status === 'paid' || status === 'succeeded') {
      return {
        gatewayStatus: params.gatewayStatus,
        status: 'paid',
        processStatus: 'sync_completed',
        processMessage: 'Stripe payment paid',
        paidAt: now,
      };
    }

    if (status === 'processing' || status === 'requires_capture') {
      return {
        gatewayStatus: params.gatewayStatus,
        status: 'authorized',
        processStatus: 'sync_completed',
        processMessage: `Stripe payment status synchronized: ${params.gatewayStatus}`,
        authorizedAt: status === 'requires_capture' ? now : null,
      };
    }

    if (
      status === 'unpaid' ||
      status === 'open' ||
      status === 'requires_payment_method' ||
      status === 'requires_action'
    ) {
      return {
        gatewayStatus: params.gatewayStatus,
        status: 'pending',
        processStatus: 'sync_completed',
        processMessage: `Stripe payment is ${params.gatewayStatus}`,
      };
    }

    if (
      status === 'expired' ||
      status === 'canceled' ||
      status === 'cancelled'
    ) {
      return {
        gatewayStatus: params.gatewayStatus,
        status: 'canceled',
        processStatus: 'sync_completed',
        processMessage: `Stripe payment is ${params.gatewayStatus}`,
        canceledAt: now,
      };
    }

    return {
      gatewayStatus: params.gatewayStatus,
      status: 'processing',
      processStatus: 'sync_completed',
      processMessage: `Stripe payment status synchronized: ${params.gatewayStatus}`,
    };
  }

  private mapPayPalStatus(gatewayStatus: string): NormalizedGatewayStatus {
    const status = this.normalize(gatewayStatus);
    const now = this.nowAsSqlDateTime();

    if (status === 'completed') {
      return {
        gatewayStatus,
        status: 'paid',
        processStatus: 'sync_completed',
        processMessage: 'PayPal order completed',
        paidAt: now,
      };
    }

    if (status === 'approved') {
      return {
        gatewayStatus,
        status: 'authorized',
        processStatus: 'sync_completed',
        processMessage: 'PayPal order approved and pending capture',
        authorizedAt: now,
      };
    }

    if (['created', 'saved', 'payer_action_required'].includes(status)) {
      return {
        gatewayStatus,
        status: 'pending',
        processStatus: 'sync_completed',
        processMessage: `PayPal order is ${gatewayStatus}`,
      };
    }

    if (status === 'voided') {
      return {
        gatewayStatus,
        status: 'canceled',
        processStatus: 'sync_completed',
        processMessage: 'PayPal order voided',
        canceledAt: now,
      };
    }

    return {
      gatewayStatus,
      status: 'processing',
      processStatus: 'sync_completed',
      processMessage: `PayPal order status synchronized: ${gatewayStatus}`,
    };
  }

  private mapPagSeguroStatus(gatewayStatus: string): NormalizedGatewayStatus {
    const status = this.normalize(gatewayStatus);
    const now = this.nowAsSqlDateTime();

    if (['paid', 'approved'].includes(status)) {
      return {
        gatewayStatus,
        status: 'paid',
        processStatus: 'sync_completed',
        processMessage: 'PagSeguro payment paid',
        paidAt: now,
      };
    }

    if (status === 'authorized') {
      return {
        gatewayStatus,
        status: 'authorized',
        processStatus: 'sync_completed',
        processMessage: 'PagSeguro payment authorized',
        authorizedAt: now,
      };
    }

    if (
      ['waiting', 'waiting_payment', 'in_analysis', 'pending'].includes(status)
    ) {
      return {
        gatewayStatus,
        status: 'pending',
        processStatus: 'sync_completed',
        processMessage: `PagSeguro payment is ${gatewayStatus}`,
      };
    }

    if (['canceled', 'cancelled'].includes(status)) {
      return {
        gatewayStatus,
        status: 'canceled',
        processStatus: 'sync_completed',
        processMessage: 'PagSeguro payment canceled',
        canceledAt: now,
      };
    }

    if (['refunded', 'chargeback'].includes(status)) {
      return {
        gatewayStatus,
        status: 'refunded',
        processStatus: 'sync_completed',
        processMessage: `PagSeguro payment is ${gatewayStatus}`,
        refundedAt: now,
      };
    }

    if (['declined', 'failed'].includes(status)) {
      return {
        gatewayStatus,
        status: 'failed',
        processStatus: 'sync_completed',
        processMessage: 'PagSeguro payment failed',
        failedAt: now,
      };
    }

    return {
      gatewayStatus,
      status: 'processing',
      processStatus: 'sync_completed',
      processMessage: `PagSeguro payment status synchronized: ${gatewayStatus}`,
    };
  }

  private requireGatewayTransactionId(
    dtoIn: GatewayPaymentStatusDtoIn,
  ): string {
    const gatewayTransactionId = this.toNullableString(
      dtoIn.paymentTransaction.gatewayTransactionId,
    );

    if (gatewayTransactionId === null) {
      throw new Error(
        'payment transaction gatewayTransactionId is required to sync status',
      );
    }

    return gatewayTransactionId;
  }

  private requireProviderToken(
    dtoIn: GatewayPaymentStatusDtoIn,
    message: string,
  ): string {
    const token =
      this.toNullableString(dtoIn.apiCredential?.token) ??
      this.toNullableString(dtoIn.apiCredential?.connectionData?.token);

    if (token === null) {
      throw new Error(message);
    }

    return token;
  }

  private resolveBaseUrl(
    dtoIn: GatewayPaymentStatusDtoIn,
    fallback: string,
  ): string {
    const gatewayConfig = this.asObject(dtoIn.config.gatewayConfig);
    const apiCredentialConfig = this.asObject(dtoIn.config.apiCredentialConfig);
    const transactionConfig = this.asObject(dtoIn.config.transactionConfig);

    return (
      this.toNullableString(transactionConfig.baseUrl) ??
      this.toNullableString(transactionConfig.base_url) ??
      this.toNullableString(apiCredentialConfig.baseUrl) ??
      this.toNullableString(apiCredentialConfig.base_url) ??
      this.toNullableString(gatewayConfig.baseUrl) ??
      this.toNullableString(gatewayConfig.base_url) ??
      fallback
    );
  }

  private async parseJsonResponse(
    response: Response,
    fallbackMessage: string,
  ): Promise<Record<string, unknown>> {
    const rawText = await response.text();

    if (rawText.trim() === '') {
      return {
        message: `${fallbackMessage}: empty response`,
        statusCode: response.status,
      };
    }

    try {
      const parsed = JSON.parse(rawText) as unknown;

      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
        return parsed as Record<string, unknown>;
      }

      if (Array.isArray(parsed)) {
        return {
          message: fallbackMessage,
          items: parsed,
          statusCode: response.status,
        };
      }

      return {
        message: `${fallbackMessage}: invalid response`,
        rawResponse: rawText,
        statusCode: response.status,
      };
    } catch {
      return {
        message: fallbackMessage,
        rawResponse: rawText.slice(0, 2000),
        statusCode: response.status,
      };
    }
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

  private nowAsSqlDateTime(): string {
    const date = new Date();

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
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
