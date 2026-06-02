import { Injectable } from '@nestjs/common';
import { createHash } from 'crypto';

import type { IGatewayPaymentProvider } from '../../contracts/gateway-payment-provider.interface';
import { GatewayPaymentDtoIn } from '../../dtos/gateway-payment.dto-in';
import { GatewayPaymentDtoOut } from '../../dtos/gateway-payment.dto-out';

type CieloSaleRequest = {
  MerchantOrderId: string;
  Customer?: {
    Name?: string;
    Email?: string;
    Identity?: string;
    IdentityType?: string;
  };
  Payment: Record<string, unknown>;
};

type CieloSaleResponse = {
  MerchantOrderId?: string;
  Customer?: Record<string, unknown>;
  Payment?: {
    PaymentId?: string;
    Type?: string;
    Amount?: number;
    Status?: number;
    ReturnCode?: string;
    ReturnMessage?: string;
    Url?: string;
    QrCodeString?: string;
    QrCodeBase64Image?: string;
    ProofOfSale?: string;
    Tid?: string;
    AuthorizationCode?: string;
    ReceivedDate?: string;
    CapturedDate?: string;
    Links?: unknown;
    [key: string]: unknown;
  };
  Message?: string;
  rawResponse?: string;
  responseHeaders?: {
    contentType: string | null;
    requestId: string | null;
  };
  [key: string]: unknown;
};

type CieloAccessTokenResponse = {
  access_token?: string;
  token_type?: string;
  expires_in?: number;
  Message?: string;
  rawResponse?: string;
  responseHeaders?: {
    contentType: string | null;
    requestId: string | null;
  };
  [key: string]: unknown;
};

type CieloPaymentLinkProductRequest = {
  OrderNumber: string;
  type: 'Asset' | 'Digital' | 'Service' | 'Payment' | 'Recurrent';
  name: string;
  description?: string;
  showDescription?: boolean;
  price: number;
  expirationDate?: string;
  softDescriptor?: string;
  maxNumberOfInstallments?: number;
  quantity?: string;
  sku?: string;
};

type CieloPaymentLinkProductResponse = {
  id?: string;
  productId?: string;
  ProductId?: string;
  OrderNumber?: string;
  CheckoutUrl?: string;
  checkoutUrl?: string;
  Url?: string;
  url?: string;
  ShortUrl?: string;
  shortUrl?: string;
  Message?: string;
  Errors?: unknown;
  rawResponse?: string;
  responseHeaders?: {
    contentType: string | null;
    requestId: string | null;
  };
  Links?: Array<{
    Method?: string;
    Rel?: string;
    Href?: string;
  }>;
  [key: string]: unknown;
};

@Injectable()
export class CieloGatewayPaymentProvider implements IGatewayPaymentProvider {
  getProviderName(): string {
    return 'cielo';
  }

  supports(gatewayProvider: string): boolean {
    const normalizedProvider = this.normalize(gatewayProvider);

    return ['cielo', 'cielo_ecommerce', 'cielo_checkout', 'cielo_link']
      .map((alias) => this.normalize(alias))
      .includes(normalizedProvider);
  }

  async processPayment(
    dtoIn: GatewayPaymentDtoIn,
  ): Promise<GatewayPaymentDtoOut> {
    try {
      if (dtoIn.paymentTransaction.paymentMethod === 'payment_link') {
        return await this.processPaymentLink(dtoIn);
      }

      if (
        dtoIn.paymentTransaction.paymentMethod === 'credit_card' ||
        dtoIn.paymentTransaction.paymentMethod === 'pix'
      ) {
        return await this.processTransparentSale(dtoIn);
      }

      return new GatewayPaymentDtoOut({
        success: false,
        provider: this.getProviderName(),

        gatewayTransactionId: null,
        gatewayStatus: null,

        status: 'failed',
        processStatus: 'gateway_payment_method_not_implemented',
        processMessage: `Cielo provider does not support payment method ${dtoIn.paymentTransaction.paymentMethod} in this adapter yet`,

        providerRequest: {
          paymentTransactionId: dtoIn.paymentTransaction._id,
          paymentMethod: dtoIn.paymentTransaction.paymentMethod,
        },

        providerResponse: {
          message: 'payment method not implemented for Cielo adapter yet',
        },

        gatewayResponse: null,

        failedAt: this.nowAsSqlDateTime(),
        expiresAt: dtoIn.paymentTransaction.expiresAt,
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'error on Cielo payment provider';

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

  private async processTransparentSale(
    dtoIn: GatewayPaymentDtoIn,
  ): Promise<GatewayPaymentDtoOut> {
    const baseUrl = this.resolveBaseUrl(dtoIn);
    const merchantId = this.resolveMerchantId(dtoIn);
    const merchantKey = this.resolveMerchantKey(dtoIn);
    const requestPayload = this.buildSaleRequestPayload(dtoIn);

    const response = await fetch(`${baseUrl}/1/sales/`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        MerchantId: merchantId,
        MerchantKey: merchantKey,
        RequestId: this.resolveRequestId(dtoIn),
      },
      body: JSON.stringify(requestPayload),
    });

    const responseBody = await this.parseJsonResponse<CieloSaleResponse>(
      response,
      'Cielo returned a non JSON sale response',
    );

    if (!response.ok) {
      return new GatewayPaymentDtoOut({
        success: false,
        provider: this.getProviderName(),

        gatewayTransactionId:
          this.toNullableString(responseBody.Payment?.PaymentId) ??
          requestPayload.MerchantOrderId,

        gatewayStatus:
          this.toNullableString(responseBody.Payment?.Status) ??
          this.toNullableString(responseBody.Message) ??
          String(response.status),

        status: 'failed',
        processStatus: 'gateway_dispatch_failed',
        processMessage:
          this.extractCieloSaleErrorMessage(responseBody) ??
          `Cielo sale request failed with status ${response.status}`,

        providerRequest: requestPayload,
        providerResponse: responseBody,
        gatewayResponse: {
          ok: false,
          httpStatus: response.status,
          endpoint: '/1/sales',
        },

        failedAt: this.nowAsSqlDateTime(),
        expiresAt: dtoIn.paymentTransaction.expiresAt,
      });
    }

    return this.mapSuccessfulSaleResponse({
      dtoIn,
      requestPayload,
      responseBody,
      httpStatus: response.status,
    });
  }

  private async processPaymentLink(
    dtoIn: GatewayPaymentDtoIn,
  ): Promise<GatewayPaymentDtoOut> {
    const baseUrl = this.resolveBaseUrl(dtoIn);
    const accessToken = await this.createCieloLinkAccessToken(dtoIn);
    const requestPayload = this.buildPaymentLinkProductRequestPayload(dtoIn);

    const response = await fetch(`${baseUrl}/api/public/v1/products/`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(requestPayload),
    });

    const responseBody =
      await this.parseJsonResponse<CieloPaymentLinkProductResponse>(
        response,
        'Cielo returned a non JSON payment link response',
      );

    if (!response.ok) {
      return new GatewayPaymentDtoOut({
        success: false,
        provider: this.getProviderName(),

        gatewayTransactionId:
          this.toNullableString(responseBody.OrderNumber) ??
          requestPayload.OrderNumber,

        gatewayStatus:
          this.toNullableString(responseBody.Message) ?? String(response.status),

        status: 'failed',
        processStatus: 'gateway_dispatch_failed',
        processMessage:
          this.extractCieloPaymentLinkErrorMessage(responseBody) ??
          `Cielo payment link request failed with status ${response.status}`,

        providerRequest: requestPayload,
        providerResponse: responseBody,
        gatewayResponse: {
          ok: false,
          httpStatus: response.status,
          endpoint: '/api/public/v1/products',
        },

        failedAt: this.nowAsSqlDateTime(),
        expiresAt: dtoIn.paymentTransaction.expiresAt,
      });
    }

    const checkoutUrl = this.extractCieloPaymentLinkUrl(responseBody);

    if (checkoutUrl === null) {
      return new GatewayPaymentDtoOut({
        success: false,
        provider: this.getProviderName(),

        gatewayTransactionId:
          this.extractCieloPaymentLinkId(responseBody) ??
          requestPayload.OrderNumber,

        gatewayStatus: 'missing_checkout_url',

        status: 'failed',
        processStatus: 'gateway_dispatch_failed',
        processMessage: 'Cielo payment link did not return checkout url',

        providerRequest: requestPayload,
        providerResponse: responseBody,
        gatewayResponse: {
          ok: true,
          httpStatus: response.status,
          endpoint: '/api/public/v1/products',
          missingCheckoutUrl: true,
        },

        failedAt: this.nowAsSqlDateTime(),
        expiresAt: dtoIn.paymentTransaction.expiresAt,
      });
    }

    return new GatewayPaymentDtoOut({
      success: true,
      provider: this.getProviderName(),

      gatewayTransactionId:
        this.extractCieloPaymentLinkId(responseBody) ??
        requestPayload.OrderNumber,

      gatewayStatus: 'created',

      status: 'pending',
      processStatus: 'gateway_pending',
      processMessage: 'Cielo payment link created',

      providerRequest: requestPayload,
      providerResponse: responseBody,
      gatewayResponse: {
        ok: true,
        httpStatus: response.status,
        endpoint: '/api/public/v1/products',
        checkoutUrl,
        paymentLinkId: this.extractCieloPaymentLinkId(responseBody),
      },

      qrCode: null,
      qrCodeBase64: null,
      boletoUrl: null,
      checkoutUrl,

      paidAt: null,
      authorizedAt: null,
      canceledAt: null,
      failedAt: null,
      refundedAt: null,

      expiresAt: dtoIn.paymentTransaction.expiresAt,
    });
  }

  private async createCieloLinkAccessToken(
    dtoIn: GatewayPaymentDtoIn,
  ): Promise<string> {
    const baseUrl = this.resolveBaseUrl(dtoIn);
    const clientId = this.resolveCieloLinkClientId(dtoIn);
    const clientSecret = this.resolveCieloLinkClientSecret(dtoIn);

    const basicToken = Buffer.from(`${clientId}:${clientSecret}`).toString(
      'base64',
    );

    const response = await fetch(`${baseUrl}/api/public/v2/token`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        Authorization: `Basic ${basicToken}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: '',
    });

    const responseBody = await this.parseJsonResponse<CieloAccessTokenResponse>(
      response,
      'Cielo returned a non JSON token response',
    );

    if (!response.ok) {
      throw new Error(
        this.toNullableString(responseBody.Message) ??
          this.toNullableString(responseBody.rawResponse) ??
          `Cielo token request failed with status ${response.status}`,
      );
    }

    const accessToken = this.toNullableString(responseBody.access_token);

    if (accessToken === null) {
      throw new Error('Cielo access token was not returned');
    }

    return accessToken;
  }

  private buildSaleRequestPayload(dtoIn: GatewayPaymentDtoIn): CieloSaleRequest {
    const providerPayload = dtoIn.providerPayload ?? {};
    const payerPayload = this.asObject(providerPayload.payer);

    const merchantOrderId = this.buildCieloOrderNumber(
      dtoIn.paymentTransaction.externalReference ??
        dtoIn.paymentTransaction.idempotencyKey ??
        dtoIn.paymentTransaction._id,
      50,
    );

    return {
      MerchantOrderId: merchantOrderId,
      Customer: this.buildCieloCustomer(payerPayload),
      Payment: this.buildCieloPayment(dtoIn),
    };
  }

  private buildCieloPayment(dtoIn: GatewayPaymentDtoIn): Record<string, unknown> {
    if (dtoIn.paymentTransaction.paymentMethod === 'pix') {
      return {
        Type: 'Pix',
        Amount: dtoIn.paymentTransaction.amount,
        Provider: 'Cielo2',
        QrCode: {
          Expiration: this.resolvePixExpiration(dtoIn),
        },
      };
    }

    if (dtoIn.paymentTransaction.paymentMethod === 'credit_card') {
      const providerPayload = dtoIn.providerPayload ?? {};
      const paymentData = this.asObject(providerPayload.paymentData);

      const cardToken =
        this.toNullableString(paymentData.cardToken) ??
        this.toNullableString(paymentData.card_token);

      const brand = this.toNullableString(paymentData.brand);

      if (cardToken !== null) {
        return {
          Type: 'CreditCard',
          Amount: dtoIn.paymentTransaction.amount,
          Installments: dtoIn.paymentTransaction.installments ?? 1,
          Capture: this.resolveCapture(dtoIn),
          CreditCard: {
            CardToken: cardToken,
            Brand: brand ?? 'Visa',
          },
        };
      }

      throw new Error(
        'paymentData.cardToken is required for Cielo credit card. Raw card fields are forbidden by SiPlug security policy.',
      );
    }

    throw new Error(
      `Cielo payment method not implemented: ${dtoIn.paymentTransaction.paymentMethod}`,
    );
  }

  private buildPaymentLinkProductRequestPayload(
    dtoIn: GatewayPaymentDtoIn,
  ): CieloPaymentLinkProductRequest {
    const config = dtoIn.config ?? {};
    const transactionConfig = this.asObject(config.transactionConfig);
    const apiCredentialConfig = this.asObject(config.apiCredentialConfig);

    const referenceId =
      dtoIn.paymentTransaction.externalReference ??
      dtoIn.paymentTransaction.idempotencyKey ??
      dtoIn.paymentTransaction._id;

    return {
      OrderNumber: this.buildCieloOrderNumber(referenceId, 20),

      type:
        this.resolveCieloLinkProductType(transactionConfig.productType) ??
        this.resolveCieloLinkProductType(apiCredentialConfig.productType) ??
        'Payment',

      name: this.limitText(
        this.toNullableString(transactionConfig.itemName) ??
          this.toNullableString(transactionConfig.name) ??
          this.toNullableString(dtoIn.paymentTransaction.externalReference) ??
          `Pagamento ${dtoIn.paymentTransaction._id}`,
        128,
      ),

      description: this.limitText(
        this.toNullableString(transactionConfig.description) ??
          this.toNullableString(dtoIn.paymentTransaction.externalReference) ??
          `Pagamento ${dtoIn.paymentTransaction._id}`,
        256,
      ),

      showDescription: true,

      price: dtoIn.paymentTransaction.amount,

      expirationDate:
        this.toNullableString(transactionConfig.expirationDate) ??
        this.toNullableString(transactionConfig.expiration_date) ??
        this.resolveCieloLinkExpirationDate(),

      softDescriptor: this.limitText(
        this.toNullableString(apiCredentialConfig.softDescriptor) ?? 'SIPLUG',
        13,
      ),

      maxNumberOfInstallments:
        this.toPositiveInteger(transactionConfig.maxNumberOfInstallments) ??
        this.toPositiveInteger(apiCredentialConfig.maxNumberOfInstallments) ??
        12,

      quantity: '1',

      sku: this.buildCieloOrderNumber(referenceId, 32),
    };
  }

  private mapSuccessfulSaleResponse(params: {
    dtoIn: GatewayPaymentDtoIn;
    requestPayload: CieloSaleRequest;
    responseBody: CieloSaleResponse;
    httpStatus: number;
  }): GatewayPaymentDtoOut {
    const payment = this.asObject(params.responseBody.Payment);

    const gatewayStatus =
      this.toNullableString(payment.Status) ??
      this.toNullableString(params.responseBody.Message) ??
      'unknown';

    const internalStatus = this.mapCieloStatusToInternalStatus(gatewayStatus);
    const processStatus = this.mapCieloStatusToProcessStatus(gatewayStatus);

    return new GatewayPaymentDtoOut({
      success: true,
      provider: this.getProviderName(),

      gatewayTransactionId:
        this.toNullableString(payment.PaymentId) ??
        params.requestPayload.MerchantOrderId,

      gatewayStatus,

      status: internalStatus,
      processStatus,
      processMessage: `Cielo sale returned status ${gatewayStatus}`,

      providerRequest: params.requestPayload,
      providerResponse: params.responseBody,
      gatewayResponse: {
        ok: true,
        httpStatus: params.httpStatus,
        endpoint: '/1/sales',
        paymentId: this.toNullableString(payment.PaymentId),
        returnCode: this.toNullableString(payment.ReturnCode),
        returnMessage: this.toNullableString(payment.ReturnMessage),
      },

      qrCode: this.toNullableString(payment.QrCodeString),
      qrCodeBase64: this.toNullableString(payment.QrCodeBase64Image),
      boletoUrl: this.toNullableString(payment.Url),
      checkoutUrl: this.toNullableString(payment.Url),

      paidAt: internalStatus === 'paid' ? this.nowAsSqlDateTime() : null,
      authorizedAt:
        internalStatus === 'authorized' ? this.nowAsSqlDateTime() : null,
      canceledAt: internalStatus === 'canceled' ? this.nowAsSqlDateTime() : null,
      failedAt: internalStatus === 'failed' ? this.nowAsSqlDateTime() : null,
      refundedAt: internalStatus === 'refunded' ? this.nowAsSqlDateTime() : null,

      expiresAt: params.dtoIn.paymentTransaction.expiresAt,
    });
  }

  private buildCieloCustomer(
    payerPayload: Record<string, unknown>,
  ): CieloSaleRequest['Customer'] {
    const document =
      this.toNullableString(payerPayload.documentValue) ??
      this.toNullableString(payerPayload.document);

    return {
      Name: this.toNullableString(payerPayload.name) ?? 'Cliente SiPlug',
      Email: this.toNullableString(payerPayload.email) ?? undefined,
      Identity: document !== null ? document.replace(/\D/g, '') : undefined,
      IdentityType:
        document !== null && document.replace(/\D/g, '').length === 14
          ? 'CNPJ'
          : 'CPF',
    };
  }

  private resolveMerchantId(dtoIn: GatewayPaymentDtoIn): string {
    const config = dtoIn.config ?? {};
    const apiCredentialConfig = this.asObject(config.apiCredentialConfig);
    const credentialConfig = dtoIn.apiCredential?.config ?? {};

    const merchantId =
      this.toNullableString(apiCredentialConfig.merchantId) ??
      this.toNullableString(apiCredentialConfig.merchant_id) ??
      this.toNullableString(credentialConfig.merchantId) ??
      this.toNullableString(credentialConfig.merchant_id);

    if (merchantId === null) {
      throw new Error('Cielo merchantId is required in api credential config');
    }

    return merchantId;
  }

  private resolveMerchantKey(dtoIn: GatewayPaymentDtoIn): string {
    const token =
      this.toNullableString(dtoIn.apiCredential?.token) ??
      this.toNullableString(dtoIn.apiCredential?.connectionData?.token);

    if (token === null) {
      throw new Error('Cielo merchantKey is required in provider token');
    }

    return token;
  }

  private resolveCieloLinkClientId(dtoIn: GatewayPaymentDtoIn): string {
    const config = dtoIn.config ?? {};
    const apiCredentialConfig = this.asObject(config.apiCredentialConfig);
    const credentialConfig = dtoIn.apiCredential?.config ?? {};

    const clientId =
      this.toNullableString(apiCredentialConfig.clientId) ??
      this.toNullableString(apiCredentialConfig.client_id) ??
      this.toNullableString(credentialConfig.clientId) ??
      this.toNullableString(credentialConfig.client_id);

    if (clientId === null) {
      throw new Error('Cielo Link clientId is required in api credential config');
    }

    return clientId;
  }

  private resolveCieloLinkClientSecret(dtoIn: GatewayPaymentDtoIn): string {
    const clientSecret =
      this.toNullableString(dtoIn.apiCredential?.token) ??
      this.toNullableString(dtoIn.apiCredential?.connectionData?.token);

    if (clientSecret === null) {
      throw new Error('Cielo Link clientSecret is required in provider token');
    }

    return clientSecret;
  }

  private resolveBaseUrl(dtoIn: GatewayPaymentDtoIn): string {
    const config = dtoIn.config ?? {};
    const apiCredentialConfig = this.asObject(config.apiCredentialConfig);

    if (dtoIn.paymentTransaction.paymentMethod === 'payment_link') {
      return (
        this.toNullableString(apiCredentialConfig.baseUrl) ??
        this.toNullableString(apiCredentialConfig.base_url) ??
        'https://cieloecommerce.cielo.com.br'
      );
    }

    return (
      this.toNullableString(apiCredentialConfig.baseUrl) ??
      this.toNullableString(apiCredentialConfig.base_url) ??
      'https://apisandbox.cieloecommerce.cielo.com.br'
    );
  }

  private resolveCapture(dtoIn: GatewayPaymentDtoIn): boolean {
    const config = dtoIn.config ?? {};
    const transactionConfig = this.asObject(config.transactionConfig);
    const apiCredentialConfig = this.asObject(config.apiCredentialConfig);

    const value = transactionConfig.capture ?? apiCredentialConfig.capture;

    return typeof value === 'boolean' ? value : true;
  }

  private resolvePixExpiration(dtoIn: GatewayPaymentDtoIn): number {
    const config = dtoIn.config ?? {};
    const transactionConfig = this.asObject(config.transactionConfig);
    const apiCredentialConfig = this.asObject(config.apiCredentialConfig);

    return (
      this.toPositiveInteger(transactionConfig.pixExpiration) ??
      this.toPositiveInteger(transactionConfig.pix_expiration) ??
      this.toPositiveInteger(apiCredentialConfig.pixExpiration) ??
      3600
    );
  }

  private resolveRequestId(dtoIn: GatewayPaymentDtoIn): string {
    return (
      dtoIn.idempotencyKey ??
      dtoIn.paymentTransaction.idempotencyKey ??
      dtoIn.paymentTransaction._id
    ).slice(0, 36);
  }

  private buildCieloOrderNumber(value: string, maxLength: number): string {
    const clean = value.replace(/[^a-zA-Z0-9]/g, '');

    if (clean.length > 0 && clean.length <= maxLength) {
      return clean;
    }

    return createHash('sha256')
      .update(value)
      .digest('hex')
      .slice(0, maxLength)
      .toUpperCase();
  }

  private resolveCieloLinkProductType(
    value: unknown,
  ): 'Asset' | 'Digital' | 'Service' | 'Payment' | 'Recurrent' | null {
    const normalized = this.normalize(String(value ?? ''));

    if (normalized === 'asset') {
      return 'Asset';
    }

    if (normalized === 'digital') {
      return 'Digital';
    }

    if (normalized === 'service') {
      return 'Service';
    }

    if (normalized === 'payment') {
      return 'Payment';
    }

    if (normalized === 'recurrent') {
      return 'Recurrent';
    }

    return null;
  }

  private resolveCieloLinkExpirationDate(): string {
    const date = new Date();
    date.setDate(date.getDate() + 7);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  private extractCieloPaymentLinkId(
    responseBody: CieloPaymentLinkProductResponse,
  ): string | null {
    return (
      this.toNullableString(responseBody.id) ??
      this.toNullableString(responseBody.productId) ??
      this.toNullableString(responseBody.ProductId) ??
      this.toNullableString(responseBody.OrderNumber)
    );
  }

  private extractCieloPaymentLinkUrl(
    responseBody: CieloPaymentLinkProductResponse,
  ): string | null {
    return (
      this.toNullableString(responseBody.CheckoutUrl) ??
      this.toNullableString(responseBody.checkoutUrl) ??
      this.toNullableString(responseBody.ShortUrl) ??
      this.toNullableString(responseBody.shortUrl) ??
      this.toNullableString(responseBody.Url) ??
      this.toNullableString(responseBody.url) ??
      (Array.isArray(responseBody.Links)
        ? responseBody.Links
            .map((link) => this.toNullableString(link.Href))
            .find((href): href is string => href !== null) ?? null
        : null)
    );
  }

  private extractCieloPaymentLinkErrorMessage(
    responseBody: CieloPaymentLinkProductResponse,
  ): string | null {
    return (
      this.toNullableString(responseBody.Message) ??
      (responseBody.Errors !== undefined
        ? JSON.stringify(responseBody.Errors)
        : null) ??
      this.toNullableString(responseBody.rawResponse)
    );
  }

  private extractCieloSaleErrorMessage(
    responseBody: CieloSaleResponse,
  ): string | null {
    return (
      this.toNullableString(responseBody.Payment?.ReturnMessage) ??
      this.toNullableString(responseBody.Payment?.ReturnCode) ??
      this.toNullableString(responseBody.Message) ??
      (responseBody.Payment !== undefined
        ? JSON.stringify(responseBody.Payment)
        : null) ??
      this.toNullableString(responseBody.rawResponse)
    );
  }

  private mapCieloStatusToInternalStatus(gatewayStatus: string): string {
    const status = Number(gatewayStatus);

    if (status === 1) {
      return 'authorized';
    }

    if (status === 2) {
      return 'paid';
    }

    if ([3, 10, 12, 20].includes(status)) {
      return 'pending';
    }

    if ([0, 13].includes(status)) {
      return 'failed';
    }

    if ([9, 11].includes(status)) {
      return 'canceled';
    }

    return 'processing';
  }

  private mapCieloStatusToProcessStatus(gatewayStatus: string): string {
    const status = Number(gatewayStatus);

    if (status === 1) {
      return 'gateway_authorized';
    }

    if (status === 2) {
      return 'gateway_approved';
    }

    if ([3, 10, 12, 20].includes(status)) {
      return 'gateway_pending';
    }

    if ([0, 13].includes(status)) {
      return 'gateway_rejected';
    }

    if ([9, 11].includes(status)) {
      return 'gateway_cancelled';
    }

    return 'gateway_dispatched';
  }

  private async parseJsonResponse<T extends Record<string, unknown>>(
    response: Response,
    fallbackMessage: string,
  ): Promise<T> {
    const rawText = await response.text();

    const responseHeaders = {
      contentType: response.headers.get('content-type'),
      requestId:
        response.headers.get('RequestId') ??
        response.headers.get('x-request-id') ??
        response.headers.get('x-correlation-id') ??
        null,
    };

    if (rawText.trim() === '') {
      return {
        Message: `${fallbackMessage}: empty response`,
        StatusCode: response.status,
        responseHeaders,
      } as unknown as T;
    }

    try {
      const parsed = JSON.parse(rawText) as unknown;

      if (
        parsed !== null &&
        typeof parsed === 'object' &&
        !Array.isArray(parsed)
      ) {
        return {
          ...(parsed as Record<string, unknown>),
          responseHeaders,
        } as unknown as T;
      }

      return {
        Message: `${fallbackMessage}: invalid JSON object response`,
        StatusCode: response.status,
        rawResponse: this.truncateText(rawText, 2000),
        responseHeaders,
      } as unknown as T;
    } catch {
      return {
        Message: fallbackMessage,
        StatusCode: response.status,
        rawResponse: this.truncateText(rawText, 2000),
        responseHeaders,
      } as unknown as T;
    }
  }

  private truncateText(value: string, maxLength: number): string {
    if (value.length <= maxLength) {
      return value;
    }

    return `${value.slice(0, maxLength)}...[TRUNCATED]`;
  }

  private limitText(value: string, maxLength: number): string {
    if (value.length <= maxLength) {
      return value;
    }

    return value.slice(0, maxLength);
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