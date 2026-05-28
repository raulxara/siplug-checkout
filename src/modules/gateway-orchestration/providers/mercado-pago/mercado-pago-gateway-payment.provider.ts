import { Injectable } from '@nestjs/common';
import type { IGatewayPaymentProvider } from '../../contracts/gateway-payment-provider.interface';
import { GatewayPaymentDtoIn } from '../../dtos/gateway-payment.dto-in';
import { GatewayPaymentDtoOut } from '../../dtos/gateway-payment.dto-out';

type MercadoPagoPixPayer = {
  email: string;
  first_name?: string;
  last_name?: string;
  identification?: {
    type: string;
    number: string;
  };
  address?: {
    zip_code?: string;
    street_name?: string;
    street_number?: string;
    neighborhood?: string;
    city?: string;
    federal_unit?: string;
  };
};

type MercadoPagoPixPaymentRequest = {
  transaction_amount: number;
  description: string;
  payment_method_id: 'pix';
  payer: MercadoPagoPixPayer;
  external_reference?: string;
  notification_url?: string;
  date_of_expiration?: string;
  metadata?: Record<string, unknown>;
};

type MercadoPagoPixPaymentResponse = {
  id?: number | string;
  status?: string;
  status_detail?: string;
  date_approved?: string | null;
  date_created?: string | null;
  date_of_expiration?: string | null;
  external_reference?: string | null;
  transaction_amount?: number;
  currency_id?: string;
  payment_method_id?: string;
  transaction_details?: {
    net_received_amount?: number;
    total_paid_amount?: number;
    overpaid_amount?: number;
    external_resource_url?: string | null;
    installment_amount?: number;
    financial_institution?: string | null;
    transaction_id?: string | null;
  };
  point_of_interaction?: {
    type?: string;
    sub_type?: string | null;
    transaction_data?: {
      qr_code_base64?: string;
      qr_code?: string;
      ticket_url?: string;
      transaction_id?: string | null;
    };
  };
  cause?: Array<{
    code?: number | string;
    data?: string;
    description?: string;
    message?: string;
  }>;
  error?: string;
  message?: string;
  status_code?: number;
  statusCode?: number;
  [key: string]: unknown;
};

@Injectable()
export class MercadoPagoGatewayPaymentProvider
  implements IGatewayPaymentProvider
{
  getProviderName(): string {
    return 'mercado_pago';
  }

  supports(gatewayProvider: string): boolean {
    const normalizedProvider = this.normalize(gatewayProvider);

    return ['mercado_pago', 'mercadopago', 'mercado-pago']
      .map((alias) => this.normalize(alias))
      .includes(normalizedProvider);
  }

  async processPayment(
    dtoIn: GatewayPaymentDtoIn,
  ): Promise<GatewayPaymentDtoOut> {
    try {
      const accessToken = this.resolveAccessToken(dtoIn);
      const idempotencyKey = this.resolveIdempotencyKey(dtoIn);

      let requestPayload: Record<string, unknown>;

      if (dtoIn.paymentTransaction.paymentMethod === 'pix') {
        requestPayload = this.buildPixPaymentRequestPayload(
          dtoIn,
        ) as unknown as Record<string, unknown>;
      } else if (dtoIn.paymentTransaction.paymentMethod === 'credit_card') {
        requestPayload = this.buildCreditCardPaymentRequestPayload(dtoIn);
      } else if (dtoIn.paymentTransaction.paymentMethod === 'boleto') {
        requestPayload = this.buildBoletoPaymentRequestPayload(dtoIn);
      } else {
        return new GatewayPaymentDtoOut({
          success: false,
          provider: this.getProviderName(),

          gatewayTransactionId: null,
          gatewayStatus: null,

          status: 'failed',
          processStatus: 'gateway_payment_method_not_implemented',
          processMessage: `Mercado Pago provider does not support payment method ${dtoIn.paymentTransaction.paymentMethod}`,

          providerRequest: {
            paymentTransactionId: dtoIn.paymentTransaction._id,
            paymentMethod: dtoIn.paymentTransaction.paymentMethod,
          },

          providerResponse: {
            message: 'payment method not implemented for Mercado Pago adapter',
          },

          gatewayResponse: null,

          failedAt: this.nowAsSqlDateTime(),
          expiresAt: dtoIn.paymentTransaction.expiresAt,
        });
      }

      const response = await fetch('https://api.mercadopago.com/v1/payments', {
        method: 'POST',
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          'X-Idempotency-Key': idempotencyKey,
        },
        body: JSON.stringify(requestPayload),
      });

      const responseBody = (await response.json().catch(() => ({
        message: 'Mercado Pago returned a non JSON response',
      }))) as MercadoPagoPixPaymentResponse;

      if (!response.ok) {
        return new GatewayPaymentDtoOut({
          success: false,
          provider: this.getProviderName(),

          gatewayTransactionId: this.toNullableString(responseBody.id),
          gatewayStatus:
            this.toNullableString(responseBody.status) ?? String(response.status),

          status: 'failed',
          processStatus: 'gateway_dispatch_failed',
          processMessage:
            this.extractMercadoPagoErrorMessage(responseBody) ??
            `Mercado Pago Payments request failed with status ${response.status}`,

          providerRequest: requestPayload,
          providerResponse: responseBody,
          gatewayResponse: {
            httpStatus: response.status,
            ok: response.ok,
            endpoint: '/v1/payments',
          },

          failedAt: this.nowAsSqlDateTime(),
          expiresAt: dtoIn.paymentTransaction.expiresAt,
        });
      }

      return this.mapSuccessfulPixPaymentResponse({
        dtoIn,
        requestPayload,
        responseBody,
        httpStatus: response.status,
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'error on Mercado Pago payment provider';

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

  private buildPixPaymentRequestPayload(
    dtoIn: GatewayPaymentDtoIn,
  ): MercadoPagoPixPaymentRequest {
    const providerPayload = dtoIn.providerPayload ?? {};
    const checkoutSession = this.asObject(providerPayload.checkoutSession);
    const payerPayload = this.asObject(providerPayload.payer);

    const payer = this.buildPayer(payerPayload);

    const description =
      this.toNullableString(checkoutSession.description) ??
      `Pagamento ${dtoIn.paymentTransaction._id}`;

    const payload: MercadoPagoPixPaymentRequest = {
      transaction_amount: this.convertCentsToAmount(
        dtoIn.paymentTransaction.amount,
      ),
      description,
      payment_method_id: 'pix',
      payer,
      external_reference:
        dtoIn.paymentTransaction.externalReference ??
        dtoIn.paymentTransaction._id,
      metadata: {
        paymentTransactionId: dtoIn.paymentTransaction._id,
        checkoutSessionId: dtoIn.paymentTransaction.checkoutSessionId,
        officeId: dtoIn.paymentTransaction.officeId,
        clientId: dtoIn.paymentTransaction.clientId,
      },
    };

    const notificationUrl = this.resolveNotificationUrl(dtoIn);

    if (notificationUrl !== null) {
      payload.notification_url = notificationUrl;
    }

    const dateOfExpiration = this.resolveDateOfExpiration(dtoIn);

    if (dateOfExpiration !== null) {
      payload.date_of_expiration = dateOfExpiration;
    }

    return payload;
  }

  private buildCreditCardPaymentRequestPayload(
    dtoIn: GatewayPaymentDtoIn,
  ): Record<string, unknown> {
    const providerPayload = dtoIn.providerPayload ?? {};
    const checkoutSession = this.asObject(providerPayload.checkoutSession);
    const payerPayload = this.asObject(providerPayload.payer);
    const paymentData = this.asObject(providerPayload.paymentData);

    const cardToken = this.toNullableString(paymentData.cardToken);
    const paymentMethodId = this.toNullableString(paymentData.paymentMethodId);
    const issuerId = this.toNullableString(paymentData.issuerId);

    if (cardToken === null) {
      throw new Error('paymentData.cardToken is required for Mercado Pago credit card');
    }

    if (paymentMethodId === null) {
      throw new Error('paymentData.paymentMethodId is required for Mercado Pago credit card');
    }

    const payer = this.buildPayer(payerPayload);

    const description =
      this.toNullableString(checkoutSession.description) ??
      `Pagamento ${dtoIn.paymentTransaction._id}`;

    const payload: Record<string, unknown> = {
      token: cardToken,
      transaction_amount: this.convertCentsToAmount(
        dtoIn.paymentTransaction.amount,
      ),
      installments: dtoIn.paymentTransaction.installments ?? 1,
      payment_method_id: paymentMethodId,
      description,
      payer,
      external_reference:
        dtoIn.paymentTransaction.externalReference ??
        dtoIn.paymentTransaction._id,
      metadata: {
        paymentTransactionId: dtoIn.paymentTransaction._id,
        checkoutSessionId: dtoIn.paymentTransaction.checkoutSessionId,
        officeId: dtoIn.paymentTransaction.officeId,
        clientId: dtoIn.paymentTransaction.clientId,
      },
    };

    if (issuerId !== null) {
      payload.issuer_id = issuerId;
    }

    const notificationUrl = this.resolveNotificationUrl(dtoIn);

    if (notificationUrl !== null) {
      payload.notification_url = notificationUrl;
    }

    return payload;
  }

  private buildBoletoPaymentRequestPayload(
    dtoIn: GatewayPaymentDtoIn,
  ): Record<string, unknown> {
    const boletoMinimumAmountInCents = 500;

    if (dtoIn.paymentTransaction.amount < boletoMinimumAmountInCents) {
      throw new Error(
        'Mercado Pago boleto requires amount greater than or equal to R$ 5,00',
      );
    }
    const providerPayload = dtoIn.providerPayload ?? {};
    const checkoutSession = this.asObject(providerPayload.checkoutSession);
    const payerPayload = this.asObject(providerPayload.payer);

    const payer = this.buildPayer(payerPayload);

    const description =
      this.toNullableString(checkoutSession.description) ??
      `Pagamento ${dtoIn.paymentTransaction._id}`;

    const payload: Record<string, unknown> = {
      transaction_amount: this.convertCentsToAmount(
        dtoIn.paymentTransaction.amount,
      ),
      description,
      payment_method_id: 'bolbradesco',
      payer,
      external_reference:
        dtoIn.paymentTransaction.externalReference ??
        dtoIn.paymentTransaction._id,
      metadata: {
        paymentTransactionId: dtoIn.paymentTransaction._id,
        checkoutSessionId: dtoIn.paymentTransaction.checkoutSessionId,
        officeId: dtoIn.paymentTransaction.officeId,
        clientId: dtoIn.paymentTransaction.clientId,
      },
    };

    const notificationUrl = this.resolveNotificationUrl(dtoIn);

    if (notificationUrl !== null) {
      payload.notification_url = notificationUrl;
    }

    const dateOfExpiration = this.resolveDateOfExpiration(dtoIn);

    if (dateOfExpiration !== null) {
      payload.date_of_expiration = dateOfExpiration;
    }

    return payload;
  }

  private buildPayer(
    payerPayload: Record<string, unknown>,
  ): MercadoPagoPixPayer {
    const email = this.toNullableString(payerPayload.email);

    if (email === null) {
      throw new Error('payer.email is required for Mercado Pago PIX');
    }

    const name = this.toNullableString(payerPayload.name);
    const firstName = this.toNullableString(payerPayload.firstName);
    const lastName = this.toNullableString(payerPayload.lastName);

    const documentType = this.toNullableString(payerPayload.documentType);
    const documentValue = this.toNullableString(payerPayload.documentValue);

    const payer: MercadoPagoPixPayer = {
      email,
    };

    if (firstName !== null) {
      payer.first_name = firstName;
    }

    if (lastName !== null) {
      payer.last_name = lastName;
    }

    if (firstName === null && name !== null) {
      const nameParts = name.trim().split(/\s+/);

      payer.first_name = nameParts.shift() ?? name;

      if (nameParts.length > 0) {
        payer.last_name = nameParts.join(' ');
      }
    }

    if (documentType !== null && documentValue !== null) {
      payer.identification = {
        type: documentType.toUpperCase(),
        number: documentValue.replace(/\D/g, ''),
      };
    }

    const address = this.buildAddress(payerPayload);

    if (address !== null) {
      payer.address = address;
    }

    return payer;
  }

  private buildAddress(
    payerPayload: Record<string, unknown>,
  ): MercadoPagoPixPayer['address'] | null {
    const addressPayload = this.asObject(payerPayload.address);

    const zipCode =
      this.toNullableString(addressPayload.zipCode) ??
      this.toNullableString(addressPayload.zip_code);

    const streetName =
      this.toNullableString(addressPayload.streetName) ??
      this.toNullableString(addressPayload.street_name);

    const streetNumber =
      this.toNullableString(addressPayload.streetNumber) ??
      this.toNullableString(addressPayload.street_number);

    const neighborhood = this.toNullableString(addressPayload.neighborhood);
    const city = this.toNullableString(addressPayload.city);

    const federalUnit =
      this.toNullableString(addressPayload.federalUnit) ??
      this.toNullableString(addressPayload.federal_unit);

    const address: MercadoPagoPixPayer['address'] = {};

    if (zipCode !== null) {
      address.zip_code = zipCode.replace(/\D/g, '');
    }

    if (streetName !== null) {
      address.street_name = streetName;
    }

    if (streetNumber !== null) {
      address.street_number = streetNumber;
    }

    if (neighborhood !== null) {
      address.neighborhood = neighborhood;
    }

    if (city !== null) {
      address.city = city;
    }

    if (federalUnit !== null) {
      address.federal_unit = federalUnit;
    }

    return Object.keys(address).length > 0 ? address : null;
  }

  private mapSuccessfulPixPaymentResponse(params: {
    dtoIn: GatewayPaymentDtoIn;
    requestPayload: Record<string, unknown>;
    responseBody: MercadoPagoPixPaymentResponse;
    httpStatus: number;
  }): GatewayPaymentDtoOut {
    const gatewayStatus =
      this.toNullableString(params.responseBody.status) ?? 'unknown';

    const gatewayStatusDetail = this.toNullableString(
      params.responseBody.status_detail,
    );

    const internalStatus = this.mapMercadoPagoStatusToInternalStatus({
      status: gatewayStatus,
      statusDetail: gatewayStatusDetail,
    });

    const processStatus = this.mapMercadoPagoStatusToProcessStatus({
      status: gatewayStatus,
      statusDetail: gatewayStatusDetail,
    });

    const transactionData =
      params.responseBody.point_of_interaction?.transaction_data;

    const transactionDetails = params.responseBody.transaction_details;

    const boletoUrl =
      this.toNullableString(transactionDetails?.external_resource_url) ??
      null;

    return new GatewayPaymentDtoOut({
      success: true,
      provider: this.getProviderName(),

      gatewayTransactionId: this.toNullableString(params.responseBody.id),
      gatewayStatus,

      status: internalStatus,
      processStatus,
      processMessage: `Mercado Pago payment returned status ${gatewayStatus}${
        gatewayStatusDetail !== null ? `/${gatewayStatusDetail}` : ''
      }`,

      providerRequest: params.requestPayload,
      providerResponse: params.responseBody,
      gatewayResponse: {
        httpStatus: params.httpStatus,
        ok: true,
        endpoint: '/v1/payments',
        paymentId: params.responseBody.id ?? null,
        paymentStatus: params.responseBody.status ?? null,
        paymentStatusDetail: params.responseBody.status_detail ?? null,
      },

      qrCode: transactionData?.qr_code ?? null,
      qrCodeBase64: transactionData?.qr_code_base64 ?? null,
      boletoUrl,
      checkoutUrl: transactionData?.ticket_url ?? null,

      paidAt: internalStatus === 'paid' ? this.nowAsSqlDateTime() : null,
      authorizedAt:
        internalStatus === 'authorized' ? this.nowAsSqlDateTime() : null,
      canceledAt:
        internalStatus === 'canceled' ? this.nowAsSqlDateTime() : null,
      failedAt: internalStatus === 'failed' ? this.nowAsSqlDateTime() : null,
      refundedAt:
        internalStatus === 'refunded' ? this.nowAsSqlDateTime() : null,

      expiresAt:
        this.formatExternalDate(params.responseBody.date_of_expiration) ??
        params.dtoIn.paymentTransaction.expiresAt,
    });
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
      throw new Error(
        'Mercado Pago token is required in api credential connection data',
      );
    }

    return token;
  }

  private resolveIdempotencyKey(dtoIn: GatewayPaymentDtoIn): string {
    const idempotencyKey =
      dtoIn.idempotencyKey ?? dtoIn.paymentTransaction.idempotencyKey;

    if (idempotencyKey !== null && idempotencyKey.trim() !== '') {
      return idempotencyKey;
    }

    return dtoIn.paymentTransaction._id;
  }

  private resolveNotificationUrl(dtoIn: GatewayPaymentDtoIn): string | null {
    const config = dtoIn.config ?? {};
    const transactionConfig = this.asObject(config.transactionConfig);
    const gatewayConfig = this.asObject(config.gatewayConfig);
    const apiCredentialConfig = this.asObject(config.apiCredentialConfig);

    return (
      this.toNullableString(transactionConfig.notificationUrl) ??
      this.toNullableString(transactionConfig.notification_url) ??
      this.toNullableString(gatewayConfig.notificationUrl) ??
      this.toNullableString(gatewayConfig.notification_url) ??
      this.toNullableString(apiCredentialConfig.notificationUrl) ??
      this.toNullableString(apiCredentialConfig.notification_url)
    );
  }

  private resolveDateOfExpiration(dtoIn: GatewayPaymentDtoIn): string | null {
    const config = dtoIn.config ?? {};
    const transactionConfig = this.asObject(config.transactionConfig);
    const gatewayConfig = this.asObject(config.gatewayConfig);
    const apiCredentialConfig = this.asObject(config.apiCredentialConfig);

    return (
      this.toNullableString(transactionConfig.dateOfExpiration) ??
      this.toNullableString(transactionConfig.date_of_expiration) ??
      this.toNullableString(gatewayConfig.dateOfExpiration) ??
      this.toNullableString(gatewayConfig.date_of_expiration) ??
      this.toNullableString(apiCredentialConfig.dateOfExpiration) ??
      this.toNullableString(apiCredentialConfig.date_of_expiration)
    );
  }

  private mapMercadoPagoStatusToInternalStatus(params: {
    status: string;
    statusDetail: string | null;
  }): string {
    const status = params.status.toLowerCase().trim();
    const statusDetail = params.statusDetail?.toLowerCase().trim() ?? null;

    if (status === 'approved') {
      return 'paid';
    }

    if (status === 'authorized') {
      return 'authorized';
    }

    if (
      status === 'pending' ||
      status === 'in_process' ||
      statusDetail === 'pending_waiting_transfer'
    ) {
      return 'pending';
    }

    if (status === 'rejected' || status === 'failed') {
      return 'failed';
    }

    if (status === 'cancelled' || status === 'canceled') {
      return 'canceled';
    }

    if (status === 'refunded') {
      return 'refunded';
    }

    return 'processing';
  }

  private mapMercadoPagoStatusToProcessStatus(params: {
    status: string;
    statusDetail: string | null;
  }): string {
    const status = params.status.toLowerCase().trim();
    const statusDetail = params.statusDetail?.toLowerCase().trim() ?? null;

    if (status === 'approved') {
      return 'gateway_approved';
    }

    if (status === 'authorized') {
      return 'gateway_authorized';
    }

    if (
      status === 'pending' ||
      status === 'in_process' ||
      statusDetail === 'pending_waiting_transfer'
    ) {
      return 'gateway_pending';
    }

    if (status === 'rejected' || status === 'failed') {
      return 'gateway_rejected';
    }

    if (status === 'cancelled' || status === 'canceled') {
      return 'gateway_cancelled';
    }

    if (status === 'refunded') {
      return 'gateway_refunded';
    }

    return 'gateway_dispatched';
  }

  private extractMercadoPagoErrorMessage(
    responseBody: MercadoPagoPixPaymentResponse,
  ): string | null {
    const message = this.toNullableString(responseBody.message);

    if (message !== null) {
      return message;
    }

    const error = this.toNullableString(responseBody.error);

    if (error !== null) {
      return error;
    }

    const cause = responseBody.cause;

    if (Array.isArray(cause) && cause.length > 0) {
      const firstCause = cause[0];

      return (
        this.toNullableString(firstCause.description) ??
        this.toNullableString(firstCause.message) ??
        this.toNullableString(firstCause.code)
      );
    }

    return null;
  }

  private convertCentsToAmount(amountInCents: number): number {
    return Number((amountInCents / 100).toFixed(2));
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

  private formatExternalDate(value: string | null | undefined): string | null {
    if (!value) {
      return null;
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return null;
    }

    return this.formatDateToSqlDateTime(date);
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