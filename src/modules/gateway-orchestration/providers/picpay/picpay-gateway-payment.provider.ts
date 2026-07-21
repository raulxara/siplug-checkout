import { Injectable } from '@nestjs/common';

import type { IGatewayPaymentProvider } from '../../contracts/gateway-payment-provider.interface';
import { GatewayPaymentDtoIn } from '../../dtos/gateway-payment.dto-in';
import { GatewayPaymentDtoOut } from '../../dtos/gateway-payment.dto-out';
import { createHash } from 'crypto';

type PicPayOAuthResponse = {
  access_token?: string;
  token_type?: string;
  expires_in?: number;
  error?: string;
  error_description?: string;
  message?: string;
  [key: string]: unknown;
};

type PicPayPaymentLinkRequest = {
  charge: {
    name: string;
    description: string;
    order_number: string;
    redirect_url: string;
    payment: {
      methods: Array<'BRCODE' | 'CREDIT_CARD'>;
      brcode_arrangements?: Array<'PICPAY' | 'PIX'>;
    };
    amounts: {
      product: number;
      delivery: number;
    };
  };
  options: {
    allow_create_pix_key: boolean;
    card_max_installment_number: number;
    expired_at: string;
  };
};

type PicPayPaymentLinkResponse = {
  brcode?: string;
  name?: string;
  description?: string;
  amount?: number;
  link?: string;
  deeplink?: string;
  pixKey?: string;
  pix_key?: string;
  txid?: string;
  paymentMethods?: string[];
  payment_methods?: string[];
  paymentBrcodeArrangements?: string[];
  payment_brcode_arrangements?: string[];
  status?: string;
  chargeName?: string;
  charge_name?: string;
  expirationDate?: string;
  expiration_date?: string;
  ppMaxInstallmentNumber?: number | null;
  cardMaxInstallmentNumber?: number | null;
  maxPaymentQuantity?: number | null;

  id?: string;
  paymentLinkId?: string;
  payment_link_id?: string;
  referenceId?: string;
  reference_id?: string;
  url?: string;
  paymentUrl?: string;
  payment_url?: string;
  checkoutUrl?: string;
  checkout_url?: string;
  message?: string;
  error?: string;
  errors?: unknown;
  rawResponse?: string;
  responseHeaders?: {
    requestId: string | null;
    contentType: string | null;
  };
  [key: string]: unknown;
};

@Injectable()
export class PicPayGatewayPaymentProvider implements IGatewayPaymentProvider {
  getProviderName(): string {
    return 'picpay';
  }

  supports(gatewayProvider: string): boolean {
    const normalizedProvider = this.normalize(gatewayProvider);

    return ['picpay', 'pic_pay', 'picpay_checkout', 'picpay_payment_link']
      .map((alias) => this.normalize(alias))
      .includes(normalizedProvider);
  }

  async processPayment(
    dtoIn: GatewayPaymentDtoIn,
  ): Promise<GatewayPaymentDtoOut> {
    try {
      if (
        !['payment_link', 'pix', 'credit_card'].includes(
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
          processMessage: `PicPay provider does not support payment method ${dtoIn.paymentTransaction.paymentMethod}`,

          providerRequest: {
            paymentTransactionId: dtoIn.paymentTransaction._id,
            paymentMethod: dtoIn.paymentTransaction.paymentMethod,
          },

          providerResponse: {
            message: 'payment method not implemented for PicPay adapter',
          },

          gatewayResponse: null,

          qrCode: null,
          qrCodeBase64: null,
          boletoUrl: null,
          checkoutUrl: null,

          failedAt: this.nowAsSqlDateTime(),
          expiresAt: dtoIn.paymentTransaction.expiresAt,
        });
      }

      const accessToken = await this.resolveAccessToken(dtoIn);
      const baseUrl = this.resolveBaseUrl(dtoIn);
      const apiPath = this.resolveApiPath(dtoIn);
      const requestPayload = this.buildPaymentLinkRequestPayload(dtoIn);

      const response = await fetch(`${baseUrl}${apiPath}/paymentlink/create`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestPayload),
      });

      const responseBody = await this.parsePicPayResponse(response);

      if (!response.ok) {
        if (response.status >= 500) {
          return new GatewayPaymentDtoOut({
            success: false,
            provider: this.getProviderName(),

            gatewayTransactionId: requestPayload.charge.order_number,

            gatewayStatus: String(response.status),

            status: 'pending',
            processStatus: 'gateway_unavailable_retryable',
            processMessage:
              this.extractPicPayErrorMessage(responseBody) ??
              `PicPay gateway unavailable with status ${response.status}`,

            providerRequest: requestPayload,
            providerResponse: responseBody,
            gatewayResponse: {
              ok: false,
              httpStatus: response.status,
              endpoint: `${apiPath}/paymentlink/create`,
              retryable: true,
            },

            qrCode: null,
            qrCodeBase64: null,
            boletoUrl: null,
            checkoutUrl: null,

            failedAt: null,
            expiresAt: dtoIn.paymentTransaction.expiresAt,
          });
        }

        return new GatewayPaymentDtoOut({
          success: false,
          provider: this.getProviderName(),

          gatewayTransactionId: requestPayload.charge.order_number,

          gatewayStatus:
            this.toNullableString(responseBody.status) ?? String(response.status),

          status: 'failed',
          processStatus: 'gateway_dispatch_failed',
          processMessage:
            this.extractPicPayErrorMessage(responseBody) ??
            `PicPay payment link request failed with status ${response.status}`,

          providerRequest: requestPayload,
          providerResponse: responseBody,
          gatewayResponse: {
            ok: false,
            httpStatus: response.status,
            endpoint: `${apiPath}/paymentlink/create`,
          },

          qrCode: null,
          qrCodeBase64: null,
          boletoUrl: null,
          checkoutUrl: null,

          failedAt: this.nowAsSqlDateTime(),
          expiresAt: dtoIn.paymentTransaction.expiresAt,
        });
      }

      const checkoutUrl = this.extractCheckoutUrl(responseBody);

      if (checkoutUrl === null) {
        return new GatewayPaymentDtoOut({
          success: false,
          provider: this.getProviderName(),

          gatewayTransactionId: requestPayload.charge.order_number,

          gatewayStatus: 'missing_checkout_url',

          status: 'failed',
          processStatus: 'gateway_dispatch_failed',
          processMessage: 'PicPay did not return checkout url',

          providerRequest: requestPayload,
          providerResponse: responseBody,
          gatewayResponse: {
            ok: true,
            httpStatus: response.status,
            endpoint: `${apiPath}/paymentlink/create`,
            missingCheckoutUrl: true,
          },

          qrCode: null,
          qrCodeBase64: null,
          boletoUrl: null,
          checkoutUrl: null,

          failedAt: this.nowAsSqlDateTime(),
          expiresAt: dtoIn.paymentTransaction.expiresAt,
        });
      }

      const gatewayStatus =
        this.toNullableString(responseBody.status) ?? 'created';

      const paymentLinkPublicId = this.extractPaymentLinkPublicId(responseBody);
      const paymentLinkId = this.extractPaymentLinkId(responseBody);

      const txid = this.toNullableString(responseBody.txid);
      const brcode = this.toNullableString(responseBody.brcode);
      const deeplink = this.toNullableString(responseBody.deeplink);
      const publicLink = this.toNullableString(responseBody.link);

      return new GatewayPaymentDtoOut({
        success: true,
        provider: this.getProviderName(),

        gatewayTransactionId: requestPayload.charge.order_number,

        gatewayStatus,

        status: this.mapPicPayStatusToInternalStatus(gatewayStatus),
        processStatus: this.mapPicPayStatusToProcessStatus(gatewayStatus),
        processMessage: `PicPay payment link returned status ${gatewayStatus}`,

        providerRequest: requestPayload,
        providerResponse: responseBody,
        gatewayResponse: {
          ok: true,
          httpStatus: response.status,
          endpoint: `${apiPath}/paymentlink/create`,
          merchantChargeId: requestPayload.charge.order_number,
          paymentLinkId,
          paymentLinkPublicId,
          txid,
          link: publicLink,
          deeplink,
          brcode,
          checkoutUrl,
        },

        qrCode: brcode,
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
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'error on PicPay provider';

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

        qrCode: null,
        qrCodeBase64: null,
        boletoUrl: null,
        checkoutUrl: null,

        failedAt: this.nowAsSqlDateTime(),
        expiresAt: dtoIn.paymentTransaction.expiresAt,
      });
    }
  }

  private async resolveAccessToken(dtoIn: GatewayPaymentDtoIn): Promise<string> {
    const config = dtoIn.config ?? {};
    const apiCredentialConfig = this.asObject(config.apiCredentialConfig);
    const clientId =
      this.toNullableString(apiCredentialConfig.clientId) ??
      this.toNullableString(apiCredentialConfig.client_id);

    const clientSecret =
      this.toNullableString(dtoIn.apiCredential?.token) ??
      this.toNullableString(dtoIn.apiCredential?.connectionData?.token);

    const useOAuth =
      clientId !== null &&
      clientSecret !== null &&
      Boolean(apiCredentialConfig.useOAuth ?? true);

    if (!useOAuth) {
      const token =
        this.toNullableString(dtoIn.apiCredential?.token) ??
        this.toNullableString(dtoIn.apiCredential?.connectionData?.token);

      if (token === null) {
        throw new Error('PicPay token is required');
      }

      return token;
    }

    const tokenUrl = this.resolveTokenUrl(dtoIn);

    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        grant_type: 'client_credentials',
        client_id: clientId,
        client_secret: clientSecret,
      }),
    });

    const responseBody = (await response.json().catch(() => ({
      message: 'PicPay returned a non JSON OAuth response',
    }))) as PicPayOAuthResponse;

    if (!response.ok) {
      throw new Error(
        this.toNullableString(responseBody.error_description) ??
          this.toNullableString(responseBody.message) ??
          this.toNullableString(responseBody.error) ??
          `PicPay OAuth request failed with status ${response.status}`,
      );
    }

    const accessToken = this.toNullableString(responseBody.access_token);

    if (accessToken === null) {
      throw new Error('PicPay access token was not returned');
    }

    return accessToken;
  }

  private buildPicPayOrderNumber(referenceId: string): string {
    const cleanReference = referenceId.replace(/[^a-zA-Z0-9]/g, '');

    if (cleanReference.length > 0 && cleanReference.length <= 15) {
        return cleanReference;
    }

    const hash = createHash('sha256')
        .update(referenceId)
        .digest('hex')
        .slice(0, 13)
        .toUpperCase();

    return `PP${hash}`;
    }

  private extractPaymentLinkPublicId(
    responseBody: PicPayPaymentLinkResponse,
  ): string | null {
    const link =
      this.toNullableString(responseBody.link) ??
      this.toNullableString(responseBody.paymentUrl) ??
      this.toNullableString(responseBody.payment_url) ??
      this.toNullableString(responseBody.checkoutUrl) ??
      this.toNullableString(responseBody.checkout_url);

    if (link === null) {
      return null;
    }

    const match = link.match(/\/p\/([^/?#]+)/);

    if (!match || !match[1]) {
      return null;
    }

    return match[1];
  }

  private resolvePicPayPaymentMethods(paymentMethod: string): {
    methods: Array<'BRCODE' | 'CREDIT_CARD'>;
    brcodeArrangements: Array<'PICPAY' | 'PIX'>;
    } {
    const normalizedMethod = this.normalize(paymentMethod);

    if (normalizedMethod === 'pix') {
        return {
        methods: ['BRCODE'],
        brcodeArrangements: ['PICPAY', 'PIX'],
        };
    }

    if (normalizedMethod === 'credit_card') {
        return {
        methods: ['CREDIT_CARD'],
        brcodeArrangements: ['PICPAY', 'PIX'],
        };
    }

    return {
        methods: ['BRCODE', 'CREDIT_CARD'],
        brcodeArrangements: ['PICPAY', 'PIX'],
    };
  }

  private resolveTokenUrl(dtoIn: GatewayPaymentDtoIn): string {
    const config = dtoIn.config ?? {};
    const gatewayConfig = this.asObject(config.gatewayConfig);
    const apiCredentialConfig = this.asObject(config.apiCredentialConfig);

    return (
      this.toNullableString(apiCredentialConfig.tokenUrl) ??
      this.toNullableString(apiCredentialConfig.token_url) ??
      this.toNullableString(gatewayConfig.tokenUrl) ??
      this.toNullableString(gatewayConfig.token_url) ??
      `${this.resolveBaseUrl(dtoIn)}/oauth2/token`
    );
  }

  private resolvePicPayExpirationDate(dtoIn: GatewayPaymentDtoIn): string {
    const config = dtoIn.config ?? {};
    const transactionConfig = this.asObject(config.transactionConfig);
    const apiCredentialConfig = this.asObject(config.apiCredentialConfig);

    const configuredDate =
        this.toNullableString(transactionConfig.expiredAt) ??
        this.toNullableString(transactionConfig.expired_at) ??
        this.toNullableString(apiCredentialConfig.expiredAt) ??
        this.toNullableString(apiCredentialConfig.expired_at);

    if (configuredDate !== null) {
        return configuredDate.slice(0, 10);
    }

    const date = new Date();
    date.setDate(date.getDate() + 7);

    const year = date.getFullYear();
    const month = this.pad(date.getMonth() + 1);
    const day = this.pad(date.getDate());

    return `${year}-${month}-${day}`;
    }

  private buildPaymentLinkRequestPayload(
    dtoIn: GatewayPaymentDtoIn,
    ): PicPayPaymentLinkRequest {
    const config = dtoIn.config ?? {};
    const transactionConfig = this.asObject(config.transactionConfig);
    const gatewayConfig = this.asObject(config.gatewayConfig);
    const apiCredentialConfig = this.asObject(config.apiCredentialConfig);

    const referenceId =
        dtoIn.paymentTransaction.externalReference ??
        dtoIn.paymentTransaction.idempotencyKey ??
        dtoIn.paymentTransaction._id;

    const redirectUrl =
        this.toNullableString(transactionConfig.redirectUrl) ??
        this.toNullableString(transactionConfig.redirect_url) ??
        this.toNullableString(transactionConfig.returnUrl) ??
        this.toNullableString(transactionConfig.return_url) ??
        this.toNullableString(transactionConfig.successUrl) ??
        this.toNullableString(transactionConfig.success_url) ??
        this.toNullableString(gatewayConfig.redirectUrl) ??
        this.toNullableString(gatewayConfig.redirect_url) ??
        this.toNullableString(gatewayConfig.returnUrl) ??
        this.toNullableString(gatewayConfig.return_url) ??
        this.toNullableString(apiCredentialConfig.redirectUrl) ??
        this.toNullableString(apiCredentialConfig.redirect_url) ??
        this.toNullableString(apiCredentialConfig.returnUrl) ??
        this.toNullableString(apiCredentialConfig.return_url) ??
        'https://siplug.com/payment/success';

    const paymentMethods = this.resolvePicPayPaymentMethods(
        dtoIn.paymentTransaction.paymentMethod,
    );

    const installments =
        this.toPositiveInteger(transactionConfig.cardMaxInstallmentNumber) ??
        this.toPositiveInteger(transactionConfig.card_max_installment_number) ??
        this.toPositiveInteger(apiCredentialConfig.cardMaxInstallmentNumber) ??
        this.toPositiveInteger(apiCredentialConfig.card_max_installment_number) ??
        3;

    return {
        charge: {
        name: this.limitText(
        this.toNullableString(transactionConfig.chargeName) ??
            this.toNullableString(transactionConfig.charge_name) ??
            this.toNullableString(dtoIn.paymentTransaction.externalReference) ??
            `Cobrança ${dtoIn.paymentTransaction._id}`,
        100,
        ),

        description: this.limitText(
        this.toNullableString(transactionConfig.description) ??
            this.toNullableString(dtoIn.paymentTransaction.externalReference) ??
            `Pagamento ${dtoIn.paymentTransaction._id}`,
        255,
        ),

        order_number: this.buildPicPayOrderNumber(referenceId),

        redirect_url: redirectUrl,

        payment: {
            methods: paymentMethods.methods,
            brcode_arrangements: paymentMethods.brcodeArrangements,
        },

        amounts: {
            product: dtoIn.paymentTransaction.amount,
            delivery:
            this.toPositiveInteger(transactionConfig.deliveryAmount) ??
            this.toPositiveInteger(transactionConfig.delivery_amount) ??
            0,
        },
        },

        options: {
        allow_create_pix_key: true,
        card_max_installment_number: installments,
        expired_at: this.resolvePicPayExpirationDate(dtoIn),
        },
    };
    }

    private limitText(value: string, maxLength: number): string {
    if (value.length <= maxLength) {
        return value;
    }

    return value.slice(0, maxLength);
    }

  private async parsePicPayResponse(
    response: Response,
  ): Promise<PicPayPaymentLinkResponse> {
    const rawText = await response.text();

    if (rawText.trim() === '') {
      return {
        message: 'PicPay returned an empty response',
        rawResponse: rawText,
      };
    }

    try {
      return JSON.parse(rawText) as PicPayPaymentLinkResponse;
    } catch {
      return {
        message: 'PicPay returned a non JSON response',
        rawResponse: rawText,
      };
    }
  }

  private extractPaymentLinkId(
    responseBody: PicPayPaymentLinkResponse,
    ): string | null {
    return (
        this.toNullableString(responseBody.txid) ??
        this.toNullableString(responseBody.id) ??
        this.toNullableString(responseBody.paymentLinkId) ??
        this.toNullableString(responseBody.payment_link_id) ??
        this.toNullableString(responseBody.referenceId) ??
        this.toNullableString(responseBody.reference_id)
    );
    }

  private extractCheckoutUrl(
    responseBody: PicPayPaymentLinkResponse,
    ): string | null {
    return (
        this.toNullableString(responseBody.link) ??
        this.toNullableString(responseBody.deeplink) ??
        this.toNullableString(responseBody.url) ??
        this.toNullableString(responseBody.paymentUrl) ??
        this.toNullableString(responseBody.payment_url) ??
        this.toNullableString(responseBody.checkoutUrl) ??
        this.toNullableString(responseBody.checkout_url)
    );
    }

  private extractPicPayErrorMessage(
    responseBody: PicPayPaymentLinkResponse,
  ): string | null {
    return (
      this.toNullableString(responseBody.message) ??
      this.toNullableString(responseBody.error) ??
      (responseBody.errors !== undefined
        ? JSON.stringify(responseBody.errors)
        : null) ??
      this.toNullableString(responseBody.rawResponse)
    );
  }

  private mapPicPayStatusToInternalStatus(gatewayStatus: string): string {
    const status = this.normalize(gatewayStatus);

    if (['paid', 'approved', 'completed', 'complete'].includes(status)) {
      return 'paid';
    }

    if (['created', 'pending', 'active', 'waiting_payment'].includes(status)) {
      return 'pending';
    }

    if (['cancelled', 'canceled', 'expired'].includes(status)) {
      return 'canceled';
    }

    if (['failed', 'refused', 'rejected'].includes(status)) {
      return 'failed';
    }

    return 'pending';
  }

  private mapPicPayStatusToProcessStatus(gatewayStatus: string): string {
    const status = this.normalize(gatewayStatus);

    if (['paid', 'approved', 'completed', 'complete'].includes(status)) {
      return 'gateway_approved';
    }

    if (['created', 'pending', 'active', 'waiting_payment'].includes(status)) {
      return 'gateway_pending';
    }

    if (['cancelled', 'canceled', 'expired'].includes(status)) {
      return 'gateway_cancelled';
    }

    if (['failed', 'refused', 'rejected'].includes(status)) {
      return 'gateway_rejected';
    }

    return 'gateway_pending';
  }

  private resolveBaseUrl(dtoIn: GatewayPaymentDtoIn): string {
    const config = dtoIn.config ?? {};
    const gatewayConfig = this.asObject(config.gatewayConfig);
    const apiCredentialConfig = this.asObject(config.apiCredentialConfig);

    return (
      this.toNullableString(apiCredentialConfig.baseUrl) ??
      this.toNullableString(apiCredentialConfig.base_url) ??
      this.toNullableString(gatewayConfig.baseUrl) ??
      this.toNullableString(gatewayConfig.base_url) ??
      'https://api.ms.qa.limbo.work'
    );
  }

  private resolveApiPath(dtoIn: GatewayPaymentDtoIn): string {
    const config = dtoIn.config ?? {};
    const apiCredentialConfig = this.asObject(config.apiCredentialConfig);

    return (
      this.toNullableString(apiCredentialConfig.apiPath) ??
      this.toNullableString(apiCredentialConfig.api_path) ??
      '/sandbox/v1'
    );
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