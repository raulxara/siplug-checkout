import { Injectable } from '@nestjs/common';
import { GatewayRecurringPaymentDtoIn } from '../../dtos/gateway-recurring-payment.dto-in';
import { GatewayRecurringPaymentDtoOut } from '../../dtos/gateway-recurring-payment.dto-out';

type PicPayApiResponse = {
  ok: boolean;
  status: number;
  body: Record<string, unknown>;
};

@Injectable()
export class PicPayRecurringPaymentProvider {
  async createSubscription(
    dtoIn: GatewayRecurringPaymentDtoIn,
  ): Promise<GatewayRecurringPaymentDtoOut> {
    if (dtoIn.paymentTransaction.paymentMethod !== 'credit_card') {
      return this.buildFailedResponse({
        dtoIn,
        gatewayStatus: 'unsupported_payment_method',
        processMessage:
          `PicPay recurring API supports only credit_card. Received: ${dtoIn.paymentTransaction.paymentMethod}`,
        providerRequest: {
          paymentMethod: dtoIn.paymentTransaction.paymentMethod,
        },
        providerResponse: {
          reason: 'unsupported_payment_method',
        },
        httpStatus: 0,
      });
    }

    const tokenDtoOut = await this.createAccessToken(dtoIn);

    if (!tokenDtoOut.ok) {
      return this.buildFailedResponse({
        dtoIn,
        gatewayStatus: String(tokenDtoOut.status),
        processMessage: this.resolvePicPayErrorMessage(
          tokenDtoOut.body,
          tokenDtoOut.status,
        ),
        providerRequest: {
          grant_type: 'client_credentials',
        },
        providerResponse: tokenDtoOut.body,
        httpStatus: tokenDtoOut.status,
      });
    }

    const accessToken = this.toRequiredString(
      tokenDtoOut.body.access_token,
      'PicPay access_token was not returned',
    );

    const planDtoOut = await this.resolveOrCreatePlan({
      dtoIn,
      accessToken,
    });

    if (!planDtoOut.ok) {
      return this.buildFailedResponse({
        dtoIn,
        gatewayStatus: String(planDtoOut.status),
        processMessage: this.resolvePicPayErrorMessage(
          planDtoOut.body,
          planDtoOut.status,
        ),
        providerRequest: planDtoOut.requestPayload,
        providerResponse: planDtoOut.body,
        httpStatus: planDtoOut.status,
      });
    }

    const subscriptionRequest = this.buildSubscriptionRequest({
      dtoIn,
      planId: planDtoOut.planId,
    });

    const subscriptionResponse = await this.executePicPayJsonRequest({
      dtoIn,
      accessToken,
      path: '/recurrency/subscriptions',
      method: 'POST',
      requestPayload: subscriptionRequest,
      requestIdSuffix: 'subscription',
    });

    if (!subscriptionResponse.ok) {
      return this.buildFailedResponse({
        dtoIn,
        gatewayStatus: String(subscriptionResponse.status),
        processMessage: this.resolvePicPayErrorMessage(
          subscriptionResponse.body,
          subscriptionResponse.status,
        ),
        providerRequest: subscriptionRequest,
        providerResponse: subscriptionResponse.body,
        httpStatus: subscriptionResponse.status,
      });
    }

    const gatewaySubscriptionId =
      this.toNullableString(subscriptionResponse.body.id) ??
      this.toNullableString(subscriptionResponse.body.subscriptionId);

    const gatewayInvoiceId = this.extractFirstChargeId(subscriptionResponse.body);

    const gatewayStatus =
      this.toNullableString(subscriptionResponse.body.status) ??
      'CREATED';

    const mappedStatus = this.mapPicPaySubscriptionStatus(gatewayStatus);

    return new GatewayRecurringPaymentDtoOut(
      true,
      'picpay',

      gatewaySubscriptionId,
      planDtoOut.planId,
      gatewayInvoiceId,
      gatewaySubscriptionId,

      gatewayStatus,
      mappedStatus.status,
      mappedStatus.processStatus,
      mappedStatus.processMessage,

      this.sanitizePayload({
        planRequest: planDtoOut.planRequestPayload,
        subscriptionRequest,
      }),
      this.sanitizePayload(subscriptionResponse.body),
      {
        ok: true,
        provider: 'picpay',
        endpoint: '/recurrency/subscriptions',
        httpStatus: subscriptionResponse.status,
        planId: planDtoOut.planId,
      },

      null,
      null,

      null,
      null,
      null,

      null,
      mappedStatus.status === 'authorized' ? this.nowAsIso() : null,
      null,
      null,
      null,
      dtoIn.paymentTransaction.expiresAt,
    );
  }

  private async resolveOrCreatePlan(params: {
    dtoIn: GatewayRecurringPaymentDtoIn;
    accessToken: string;
  }): Promise<{
    ok: boolean;
    status: number;
    body: Record<string, unknown>;
    planId: string;
    requestPayload: Record<string, unknown> | null;
    planRequestPayload: Record<string, unknown> | null;
  }> {
    const existingPlanId = this.resolvePicPayPlanId(params.dtoIn);

    if (existingPlanId !== null) {
      return {
        ok: true,
        status: 200,
        body: {
          reusedPlanId: existingPlanId,
        },
        planId: existingPlanId,
        requestPayload: null,
        planRequestPayload: null,
      };
    }

    const planRequest = this.buildPlanRequest(params.dtoIn);

    const planResponse = await this.executePicPayJsonRequest({
      dtoIn: params.dtoIn,
      accessToken: params.accessToken,
      path: '/recurrency/plans',
      method: 'POST',
      requestPayload: planRequest,
      requestIdSuffix: 'plan',
    });

    if (!planResponse.ok) {
      return {
        ok: false,
        status: planResponse.status,
        body: planResponse.body,
        planId: '',
        requestPayload: planRequest,
        planRequestPayload: planRequest,
      };
    }

    const planId = this.toRequiredString(
      planResponse.body.id,
      'PicPay plan id was not returned',
    );

    return {
      ok: true,
      status: planResponse.status,
      body: planResponse.body,
      planId,
      requestPayload: null,
      planRequestPayload: planRequest,
    };
  }

  private buildPlanRequest(
    dtoIn: GatewayRecurringPaymentDtoIn,
  ): Record<string, unknown> {
    const maxBillingCycles =
      dtoIn.subscriptionPlan.maxBillingCycles !== null &&
      dtoIn.subscriptionPlan.maxBillingCycles > 0
        ? dtoIn.subscriptionPlan.maxBillingCycles
        : 9999;

    return {
      billingCycle: this.mapPicPayBillingCycle(
        dtoIn.subscriptionPlan.billingInterval,
        dtoIn.subscriptionPlan.billingIntervalCount,
      ),
      amount: dtoIn.paymentTransaction.amount,
      totalBillingCycles: maxBillingCycles,
      initialGraceCycles: this.resolveInitialGraceCycles(dtoIn),
      tag: this.limitText(
        `${dtoIn.subscriptionPlan.slug}-${dtoIn.subscriptionPlan._id}`
          .replace(/[^a-zA-Z0-9_-]/g, '')
          .slice(0, 80),
        80,
      ),
    };
  }

  private buildSubscriptionRequest(params: {
    dtoIn: GatewayRecurringPaymentDtoIn;
    planId: string;
  }): Record<string, unknown> {
    const dtoIn = params.dtoIn;
    const payer = this.asObject(dtoIn.providerPayload.payer);
    const paymentData = this.asObject(dtoIn.providerPayload.paymentData);

    const temporaryCardToken =
      this.toNullableString(paymentData.temporaryCardToken) ??
      this.toNullableString(paymentData.temporary_card_token) ??
      this.toNullableString(paymentData.cardTokenId) ??
      this.toNullableString(paymentData.card_token_id);

    if (temporaryCardToken === null) {
      throw new Error(
        'paymentData.temporaryCardToken is required for PicPay recurring credit_card payment',
      );
    }

    const documentValue = this.onlyDigits(
      this.toRequiredString(
        payer.documentValue,
        'payer.documentValue is required for PicPay recurring payment',
      ),
    );

    const documentType = this.normalizeDocumentType(
      this.toNullableString(payer.documentType) ?? 'CPF',
    );

    const phone = this.asObject(payer.phone);

    return {
      customer: {
        name: this.limitText(
          this.toRequiredString(
            payer.name,
            'payer.name is required for PicPay recurring payment',
          ),
          255,
        ),
        email: this.toRequiredString(
          payer.email,
          'payer.email is required for PicPay recurring payment',
        ),
        documentType,
        document: documentValue,
        phone: {
          countryCode:
            this.onlyDigits(this.toNullableString(phone.countryCode) ?? '') ||
            this.onlyDigits(this.toNullableString(phone.country) ?? '') ||
            '55',
          areaCode:
            this.onlyDigits(this.toNullableString(phone.areaCode) ?? '') ||
            this.onlyDigits(this.toNullableString(phone.area) ?? '') ||
            '11',
          number:
            this.onlyDigits(this.toNullableString(phone.number) ?? '') ||
            '999999999',
          type: this.toNullableString(phone.type) ?? 'MOBILE',
        },
      },
      credit: {
        temporaryCardToken,
        cardholderDocument:
          this.onlyDigits(
            this.toNullableString(paymentData.cardholderDocument) ??
              this.toNullableString(paymentData.cardholder_document) ??
              documentValue,
          ) || documentValue,
        cardholderName:
          this.toNullableString(paymentData.cardholderName) ??
          this.toNullableString(paymentData.cardholder_name) ??
          this.toRequiredString(
            payer.name,
            'payer.name is required for PicPay cardholderName',
          ),
        brand:
          this.toNullableString(paymentData.brand) ??
          this.toNullableString(paymentData.cardBrand) ??
          'Visa',
      },
      planId: params.planId,
      merchantSubscriptionId: dtoIn.paymentTransaction._id,
    };
  }

  private async createAccessToken(
    dtoIn: GatewayRecurringPaymentDtoIn,
  ): Promise<PicPayApiResponse> {
    const apiCredentialConfig = this.asObject(dtoIn.apiCredential.config);
    const connectionData = this.asObject(dtoIn.apiCredential.connectionData);

    const clientId =
      this.toNullableString(apiCredentialConfig.clientId) ??
      this.toNullableString(apiCredentialConfig.client_id) ??
      this.toNullableString(connectionData.clientId) ??
      this.toNullableString(connectionData.client_id);

    const clientSecret =
      this.toNullableString(dtoIn.apiCredential.token) ??
      this.toNullableString(apiCredentialConfig.clientSecret) ??
      this.toNullableString(apiCredentialConfig.client_secret) ??
      this.toNullableString(connectionData.clientSecret) ??
      this.toNullableString(connectionData.client_secret);

    if (clientId === null) {
      throw new Error('PicPay clientId is required');
    }

    if (clientSecret === null) {
      throw new Error('PicPay clientSecret is required');
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

    const body = await this.parseJsonResponse(
      response,
      'PicPay returned a non JSON OAuth response',
    );

    return {
      ok: response.ok,
      status: response.status,
      body,
    };
  }

  private async executePicPayJsonRequest(params: {
    dtoIn: GatewayRecurringPaymentDtoIn;
    accessToken: string;
    path: string;
    method: 'POST' | 'GET' | 'PUT' | 'PATCH';
    requestPayload: Record<string, unknown>;
    requestIdSuffix: string;
  }): Promise<PicPayApiResponse> {
    const baseUrl = this.resolveApiBaseUrl(params.dtoIn);

    const response = await fetch(`${baseUrl}${params.path}`, {
      method: params.method,
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${params.accessToken}`,
        'Content-Type': 'application/json',
        'x-idempotency-key': this.normalizeIdempotencyKey(
          `${
            params.dtoIn.idempotencyKey ??
            params.dtoIn.paymentTransaction.idempotencyKey ??
            params.dtoIn.paymentTransaction._id
          }-${params.requestIdSuffix}`,
        ),
      },
      body: JSON.stringify(params.requestPayload),
    });

    const body = await this.parseJsonResponse(
      response,
      `PicPay returned a non JSON response for ${params.path}`,
    );

    return {
      ok: response.ok,
      status: response.status,
      body,
    };
  }

  private resolveApiBaseUrl(dtoIn: GatewayRecurringPaymentDtoIn): string {
    const apiCredentialConfig = this.asObject(dtoIn.apiCredential.config);
    const gatewayConfig = this.asObject(dtoIn.config.gatewayConfig);

    const configuredRecurringBaseUrl =
      this.toNullableString(apiCredentialConfig.recurringBaseUrl) ??
      this.toNullableString(apiCredentialConfig.recurring_base_url) ??
      this.toNullableString(apiCredentialConfig.checkoutBaseUrl) ??
      this.toNullableString(apiCredentialConfig.checkout_base_url) ??
      this.toNullableString(gatewayConfig.recurringBaseUrl) ??
      this.toNullableString(gatewayConfig.checkoutBaseUrl);

    if (configuredRecurringBaseUrl !== null) {
      return configuredRecurringBaseUrl.replace(/\/+$/, '');
    }

    const baseUrl =
      this.toNullableString(apiCredentialConfig.baseUrl) ??
      this.toNullableString(apiCredentialConfig.base_url) ??
      this.toNullableString(gatewayConfig.baseUrl) ??
      this.toNullableString(gatewayConfig.base_url) ??
      'https://ecommerce-api.svcp.ppay.me/sandbox/v1';

    const apiPath =
      this.toNullableString(apiCredentialConfig.apiPath) ??
      this.toNullableString(apiCredentialConfig.api_path) ??
      this.toNullableString(gatewayConfig.apiPath) ??
      this.toNullableString(gatewayConfig.api_path);

    const cleanBaseUrl = baseUrl.replace(/\/+$/, '');

    if (apiPath === null) {
      return cleanBaseUrl;
    }

    return `${cleanBaseUrl}/${apiPath.replace(/^\/+/, '').replace(/\/+$/, '')}`;
  }

  private resolveTokenUrl(dtoIn: GatewayRecurringPaymentDtoIn): string {
    const apiCredentialConfig = this.asObject(dtoIn.apiCredential.config);
    const gatewayConfig = this.asObject(dtoIn.config.gatewayConfig);

    const tokenUrl =
      this.toNullableString(apiCredentialConfig.tokenUrl) ??
      this.toNullableString(apiCredentialConfig.token_url) ??
      this.toNullableString(gatewayConfig.tokenUrl) ??
      this.toNullableString(gatewayConfig.token_url);

    if (tokenUrl !== null) {
      return tokenUrl;
    }

    const authBaseUrl =
      this.toNullableString(apiCredentialConfig.authBaseUrl) ??
      this.toNullableString(apiCredentialConfig.auth_base_url) ??
      this.toNullableString(gatewayConfig.authBaseUrl) ??
      this.toNullableString(gatewayConfig.auth_base_url) ??
      this.toNullableString(apiCredentialConfig.baseUrl) ??
      this.toNullableString(apiCredentialConfig.base_url) ??
      'https://api.ms.qa.limbo.work';

    return `${authBaseUrl.replace(/\/+$/, '')}/oauth2/token`;
  }

  private resolvePicPayPlanId(dtoIn: GatewayRecurringPaymentDtoIn): string | null {
    const planConfig = this.asObject(dtoIn.subscriptionPlan.config);
    const gatewayMappings = this.asObject(planConfig.gatewayMappings);
    const picpayMapping = this.asObject(gatewayMappings.picpay);

    return (
      this.toNullableString(picpayMapping.planId) ??
      this.toNullableString(picpayMapping.gatewayPlanId) ??
      this.toNullableString(picpayMapping.picpayPlanId) ??
      this.toNullableString(dtoIn.subscriptionPlan.gatewayPlanId)
    );
  }

  private mapPicPayBillingCycle(
    interval: string,
    intervalCount: number,
  ): string {
    if (interval === 'day' && intervalCount === 1) {
      return 'DAILY';
    }

    if (interval === 'week' && intervalCount === 1) {
      return 'WEEKLY';
    }

    if (interval === 'month' && intervalCount === 1) {
      return 'MONTHLY';
    }

    if (interval === 'month' && intervalCount === 3) {
      return 'QUARTERLY';
    }

    if (interval === 'month' && intervalCount === 6) {
      return 'BIANNUAL';
    }

    if (interval === 'year' && intervalCount === 1) {
      return 'ANNUAL';
    }

    throw new Error(
      `unsupported PicPay recurring interval: ${interval}/${intervalCount}`,
    );
  }

  private resolveInitialGraceCycles(dtoIn: GatewayRecurringPaymentDtoIn): number {
    const planConfig = this.asObject(dtoIn.subscriptionPlan.config);
    const picpayConfig = this.asObject(planConfig.picpay);

    const configuredGraceCycles = Number(
      this.toNullableString(picpayConfig.initialGraceCycles) ?? '0',
    );

    if (Number.isFinite(configuredGraceCycles) && configuredGraceCycles > 0) {
      return configuredGraceCycles;
    }

    return 0;
  }

  private mapPicPaySubscriptionStatus(status: string): {
    status: string;
    processStatus: string;
    processMessage: string;
  } {
    const normalized = status.toUpperCase().trim();

    if (
      normalized === 'ACTIVE' ||
      normalized === 'AUTHORIZED' ||
      normalized === 'APPROVED' ||
      normalized === 'CREATED'
    ) {
      return {
        status: 'authorized',
        processStatus: 'gateway_recurring_subscription_authorized',
        processMessage: `PicPay recurring subscription created with status ${normalized}`,
      };
    }

    if (
      normalized === 'PENDING' ||
      normalized === 'PROCESSING' ||
      normalized === 'WAITING'
    ) {
      return {
        status: 'pending',
        processStatus: 'gateway_recurring_subscription_pending',
        processMessage: `PicPay recurring subscription created with status ${normalized}`,
      };
    }

    if (normalized === 'CANCELLED' || normalized === 'CANCELED') {
      return {
        status: 'canceled',
        processStatus: 'gateway_recurring_subscription_canceled',
        processMessage: 'PicPay recurring subscription canceled',
      };
    }

    return {
      status: 'pending',
      processStatus: 'gateway_recurring_subscription_created',
      processMessage: `PicPay recurring subscription created with status ${status}`,
    };
  }

  private extractFirstChargeId(
    responseBody: Record<string, unknown>,
  ): string | null {
    const charges = responseBody.charges;

    if (Array.isArray(charges) && charges.length > 0) {
      return this.toNullableString(charges[0]);
    }

    return (
      this.toNullableString(responseBody.chargeId) ??
      this.toNullableString(responseBody.charge_id)
    );
  }

  private buildFailedResponse(params: {
    dtoIn: GatewayRecurringPaymentDtoIn;
    gatewayStatus: string;
    processMessage: string;
    providerRequest: Record<string, unknown> | null;
    providerResponse: Record<string, unknown> | null;
    httpStatus: number;
  }): GatewayRecurringPaymentDtoOut {
    return new GatewayRecurringPaymentDtoOut(
      false,
      'picpay',

      null,
      this.resolvePicPayPlanId(params.dtoIn),
      null,
      null,

      params.gatewayStatus,

      'failed',
      'gateway_recurring_provider_failed',
      params.processMessage,

      this.sanitizePayload(params.providerRequest),
      this.sanitizePayload(params.providerResponse),
      {
        ok: false,
        provider: 'picpay',
        httpStatus: params.httpStatus,
      },

      null,
      null,
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

      return {
        message: fallbackMessage,
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

  private resolvePicPayErrorMessage(
    responseBody: Record<string, unknown>,
    statusCode: number,
  ): string {
    const errors = responseBody.errors;

    if (Array.isArray(errors) && errors.length > 0) {
      const firstError = this.asObject(errors[0]);

      const message =
        this.toNullableString(firstError.message) ??
        this.toNullableString(firstError.description);

      const field = this.toNullableString(firstError.field);

      if (message !== null && field !== null) {
        return `${message} (${field})`;
      }

      if (message !== null) {
        return message;
      }
    }

    return (
      this.toNullableString(responseBody.message) ??
      this.toNullableString(responseBody.error_description) ??
      this.toNullableString(responseBody.error) ??
      `PicPay recurring subscription request failed with status ${statusCode}`
    );
  }

  private normalizeDocumentType(value: string): string {
    const normalized = value.toUpperCase().trim();

    if (normalized === 'CNPJ') {
      return 'CNPJ';
    }

    if (normalized === 'PASSPORT') {
      return 'PASSPORT';
    }

    return 'CPF';
  }

  private normalizeIdempotencyKey(value: string): string {
    return value.replace(/[^a-zA-Z0-9]/g, '').slice(0, 200);
  }

  private onlyDigits(value: string | null): string {
    if (value === null) {
      return '';
    }

    return value.replace(/\D/g, '');
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
      'temporarycardtoken',
      'cardtoken',
      'providertoken',
      'authorization',
      'accesstoken',
      'clientsecret',
      'secret',
      'password',
      'card',
      'cardnumber',
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

  private toRequiredString(value: unknown, message: string): string {
    const stringValue = this.toNullableString(value);

    if (stringValue === null) {
      throw new Error(message);
    }

    return stringValue;
  }

  private limitText(value: string, limit: number): string {
    if (value.length <= limit) {
      return value;
    }

    return value.slice(0, limit);
  }

  private nowAsIso(): string {
    return new Date().toISOString();
  }
}
