import { Injectable } from '@nestjs/common';
import { GatewayRecurringPaymentDtoIn } from '../../dtos/gateway-recurring-payment.dto-in';
import { GatewayRecurringPaymentDtoOut } from '../../dtos/gateway-recurring-payment.dto-out';

type PayPalApiResponse = {
  ok: boolean;
  status: number;
  body: Record<string, unknown>;
};

@Injectable()
export class PayPalRecurringPaymentProvider {
  async createSubscription(
    dtoIn: GatewayRecurringPaymentDtoIn,
  ): Promise<GatewayRecurringPaymentDtoOut> {
    const tokenDtoOut = await this.createAccessToken(dtoIn);

    if (!tokenDtoOut.ok) {
      return this.buildFailedResponse({
        dtoIn,
        gatewayStatus: String(tokenDtoOut.status),
        processMessage: this.resolvePayPalErrorMessage(
          tokenDtoOut.body,
          tokenDtoOut.status,
        ),
        providerRequest: {
          endpoint: '/v1/oauth2/token',
          grantType: 'client_credentials',
        },
        providerResponse: tokenDtoOut.body,
        httpStatus: tokenDtoOut.status,
      });
    }

    const accessToken = this.toRequiredString(
      tokenDtoOut.body.access_token,
      'PayPal access_token was not returned',
    );

    const productAndPlanDtoOut = await this.resolveOrCreatePlan({
      dtoIn,
      accessToken,
    });

    if (!productAndPlanDtoOut.ok) {
      return this.buildFailedResponse({
        dtoIn,
        gatewayStatus: String(productAndPlanDtoOut.status),
        processMessage: this.resolvePayPalErrorMessage(
          productAndPlanDtoOut.body,
          productAndPlanDtoOut.status,
        ),
        providerRequest: productAndPlanDtoOut.requestPayload,
        providerResponse: productAndPlanDtoOut.body,
        httpStatus: productAndPlanDtoOut.status,
      });
    }

    const planId = productAndPlanDtoOut.planId;

    const subscriptionRequest = this.buildSubscriptionRequest({
      dtoIn,
      planId,
    });

    const subscriptionResponse = await this.executePayPalJsonRequest({
      dtoIn,
      accessToken,
      path: '/v1/billing/subscriptions',
      method: 'POST',
      requestPayload: subscriptionRequest,
      requestIdSuffix: 'subscription',
    });

    if (!subscriptionResponse.ok) {
      return this.buildFailedResponse({
        dtoIn,
        gatewayStatus: String(subscriptionResponse.status),
        processMessage: this.resolvePayPalErrorMessage(
          subscriptionResponse.body,
          subscriptionResponse.status,
        ),
        providerRequest: subscriptionRequest,
        providerResponse: subscriptionResponse.body,
        httpStatus: subscriptionResponse.status,
      });
    }

    const gatewaySubscriptionId = this.toNullableString(
      subscriptionResponse.body.id,
    );

    const gatewayStatus =
      this.toNullableString(subscriptionResponse.body.status) ??
      'APPROVAL_PENDING';

    const approvalUrl = this.extractApprovalUrl(subscriptionResponse.body);

    const mappedStatus = this.mapPayPalSubscriptionStatus(gatewayStatus);

    return new GatewayRecurringPaymentDtoOut(
      true,
      'paypal',

      gatewaySubscriptionId,
      planId,
      null,
      gatewaySubscriptionId,

      gatewayStatus,
      mappedStatus.status,
      mappedStatus.processStatus,
      mappedStatus.processMessage,

      this.sanitizePayload({
        productRequest: productAndPlanDtoOut.productRequestPayload,
        planRequest: productAndPlanDtoOut.planRequestPayload,
        subscriptionRequest,
      }),
      this.sanitizePayload(subscriptionResponse.body),
      {
        ok: true,
        provider: 'paypal',
        endpoint: '/v1/billing/subscriptions',
        httpStatus: subscriptionResponse.status,
        productId: productAndPlanDtoOut.productId,
        planId,
      },

      approvalUrl,
      approvalUrl,

      null,
      null,
      null,

      null,
      null,
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
    productId: string | null;
    planId: string;
    requestPayload: Record<string, unknown> | null;
    productRequestPayload: Record<string, unknown> | null;
    planRequestPayload: Record<string, unknown> | null;
  }> {
    const existingPlanId = this.resolvePayPalPlanId(params.dtoIn);

    if (existingPlanId !== null) {
      return {
        ok: true,
        status: 200,
        body: {
          reusedPlanId: existingPlanId,
        },
        productId: this.resolvePayPalProductId(params.dtoIn),
        planId: existingPlanId,
        requestPayload: null,
        productRequestPayload: null,
        planRequestPayload: null,
      };
    }

    const productRequest = this.buildProductRequest(params.dtoIn);

    const productResponse = await this.executePayPalJsonRequest({
      dtoIn: params.dtoIn,
      accessToken: params.accessToken,
      path: '/v1/catalogs/products',
      method: 'POST',
      requestPayload: productRequest,
      requestIdSuffix: 'product',
    });

    if (!productResponse.ok) {
      return {
        ok: false,
        status: productResponse.status,
        body: productResponse.body,
        productId: null,
        planId: '',
        requestPayload: productRequest,
        productRequestPayload: productRequest,
        planRequestPayload: null,
      };
    }

    const productId = this.toRequiredString(
      productResponse.body.id,
      'PayPal product id was not returned',
    );

    const planRequest = this.buildPlanRequest({
      dtoIn: params.dtoIn,
      productId,
    });

    const planResponse = await this.executePayPalJsonRequest({
      dtoIn: params.dtoIn,
      accessToken: params.accessToken,
      path: '/v1/billing/plans',
      method: 'POST',
      requestPayload: planRequest,
      requestIdSuffix: 'plan',
    });

    if (!planResponse.ok) {
      return {
        ok: false,
        status: planResponse.status,
        body: planResponse.body,
        productId,
        planId: '',
        requestPayload: planRequest,
        productRequestPayload: productRequest,
        planRequestPayload: planRequest,
      };
    }

    const planId = this.toRequiredString(
      planResponse.body.id,
      'PayPal plan id was not returned',
    );

    return {
      ok: true,
      status: planResponse.status,
      body: planResponse.body,
      productId,
      planId,
      requestPayload: null,
      productRequestPayload: productRequest,
      planRequestPayload: planRequest,
    };
  }

  private buildProductRequest(
    dtoIn: GatewayRecurringPaymentDtoIn,
  ): Record<string, unknown> {
    return {
      name: this.limitText(dtoIn.subscriptionPlan.name, 127),
      description: this.limitText(
        dtoIn.subscriptionPlan.description ??
          dtoIn.subscriptionPlan.name,
        256,
      ),
      type: 'SERVICE',
      category: 'SOFTWARE',
      home_url: this.resolveSuccessUrl(dtoIn) ?? 'https://siplug.com',
    };
  }

  private buildPlanRequest(params: {
    dtoIn: GatewayRecurringPaymentDtoIn;
    productId: string;
  }): Record<string, unknown> {
    const dtoIn = params.dtoIn;
    const billingCycles: Array<Record<string, unknown>> = [];

    let regularSequence = 1;

    if (
      dtoIn.subscriptionPlan.trialDays !== null &&
      dtoIn.subscriptionPlan.trialDays > 0
    ) {
      billingCycles.push({
        frequency: {
          interval_unit: 'DAY',
          interval_count: dtoIn.subscriptionPlan.trialDays,
        },
        tenure_type: 'TRIAL',
        sequence: 1,
        total_cycles: 1,
        pricing_scheme: {
          fixed_price: {
            value: '0.00',
            currency_code: dtoIn.paymentTransaction.currency,
          },
        },
      });

      regularSequence = 2;
    }

    billingCycles.push({
      frequency: {
        interval_unit: this.mapPayPalInterval(
          dtoIn.subscriptionPlan.billingInterval,
        ),
        interval_count: dtoIn.subscriptionPlan.billingIntervalCount,
      },
      tenure_type: 'REGULAR',
      sequence: regularSequence,
      total_cycles: dtoIn.subscriptionPlan.maxBillingCycles ?? 0,
      pricing_scheme: {
        fixed_price: {
          value: this.centsToDecimal(dtoIn.paymentTransaction.amount),
          currency_code: dtoIn.paymentTransaction.currency,
        },
      },
    });

    return {
      product_id: params.productId,
      name: this.limitText(dtoIn.subscriptionPlan.name, 127),
      description: this.limitText(
        dtoIn.subscriptionPlan.description ??
          dtoIn.subscriptionPlan.name,
        127,
      ),
      status: 'ACTIVE',
      billing_cycles: billingCycles,
      payment_preferences: {
        auto_bill_outstanding: true,
        setup_fee: {
          value: '0.00',
          currency_code: dtoIn.paymentTransaction.currency,
        },
        setup_fee_failure_action: 'CONTINUE',
        payment_failure_threshold: 3,
      },
      taxes: {
        percentage: '0',
        inclusive: false,
      },
    };
  }

  private buildSubscriptionRequest(params: {
    dtoIn: GatewayRecurringPaymentDtoIn;
    planId: string;
  }): Record<string, unknown> {
    const dtoIn = params.dtoIn;
    const payer = this.asObject(dtoIn.providerPayload.payer);

    const subscriber: Record<string, unknown> = {};

    const email = this.toNullableString(payer.email);

    if (email !== null) {
      subscriber.email_address = email;
    }

    const name = this.toNullableString(payer.name);

    if (name !== null) {
      const parts = name.split(' ').filter(Boolean);

      subscriber.name = {
        given_name: parts[0] ?? name,
        surname: parts.slice(1).join(' ') || 'Cliente',
      };
    }

    const returnUrl = this.resolvePayPalRedirectUrl({
      dtoIn,
      rawUrl: this.resolveSuccessUrl(dtoIn),
      fallbackUrl: 'https://siplug.com/payment/success',
    });

    const cancelUrl = this.resolvePayPalRedirectUrl({
      dtoIn,
      rawUrl: this.resolveCancelUrl(dtoIn),
      fallbackUrl: 'https://siplug.com/payment/cancel',
    });

    return {
      plan_id: params.planId,
      custom_id: dtoIn.paymentTransaction._id,
      quantity: '1',

      subscriber,

      application_context: {
        brand_name: 'SiPlug',
        locale: 'pt-BR',
        shipping_preference: 'NO_SHIPPING',
        user_action: 'SUBSCRIBE_NOW',
        payment_method: {
          payer_selected: 'PAYPAL',
          payee_preferred: 'IMMEDIATE_PAYMENT_REQUIRED',
        },
        return_url: returnUrl,
        cancel_url: cancelUrl,
      },
    };
  }

  private resolvePayPalRedirectUrl(params: {
    dtoIn: GatewayRecurringPaymentDtoIn;
    rawUrl: string | null;
    fallbackUrl: string;
  }): string {
    const baseUrl = params.rawUrl ?? params.fallbackUrl;

    const sanitizedUrl = baseUrl
      .replace(/\{CHECKOUT_SESSION_ID\}/g, params.dtoIn.paymentTransaction._id)
      .replace(/%7BCHECKOUT_SESSION_ID%7D/gi, params.dtoIn.paymentTransaction._id);

    try {
      const parsedUrl = new URL(sanitizedUrl);

      return parsedUrl.toString();
    } catch {
      throw new Error(`invalid PayPal redirect URL: ${sanitizedUrl}`);
    }
  }

  private async createAccessToken(
    dtoIn: GatewayRecurringPaymentDtoIn,
  ): Promise<PayPalApiResponse> {
    const credentials = this.resolveOAuthCredentials(dtoIn);
    const baseUrl = this.resolveBaseUrl(dtoIn);

    const basicToken = Buffer.from(
      `${credentials.clientId}:${credentials.clientSecret}`,
    ).toString('base64');

    const response = await fetch(`${baseUrl}/v1/oauth2/token`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        Authorization: `Basic ${basicToken}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    });

    const body = await this.parseJsonResponse(
      response,
      'PayPal returned a non JSON OAuth response',
    );

    return {
      ok: response.ok,
      status: response.status,
      body,
    };
  }

  private async executePayPalJsonRequest(params: {
    dtoIn: GatewayRecurringPaymentDtoIn;
    accessToken: string;
    path: string;
    method: 'POST' | 'GET' | 'PATCH';
    requestPayload: Record<string, unknown>;
    requestIdSuffix: string;
  }): Promise<PayPalApiResponse> {
    const baseUrl = this.resolveBaseUrl(params.dtoIn);

    const requestId =
      params.dtoIn.idempotencyKey ??
      params.dtoIn.paymentTransaction.idempotencyKey ??
      params.dtoIn.paymentTransaction._id;

    const response = await fetch(`${baseUrl}${params.path}`, {
      method: params.method,
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${params.accessToken}`,
        'Content-Type': 'application/json',
        'PayPal-Request-Id': `${requestId}-${params.requestIdSuffix}`,
        Prefer: 'return=representation',
      },
      body: JSON.stringify(params.requestPayload),
    });

    const body = await this.parseJsonResponse(
      response,
      `PayPal returned a non JSON response for ${params.path}`,
    );

    return {
      ok: response.ok,
      status: response.status,
      body,
    };
  }

  private resolveOAuthCredentials(dtoIn: GatewayRecurringPaymentDtoIn): {
    clientId: string;
    clientSecret: string;
  } {
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
      throw new Error('PayPal clientId is required');
    }

    if (clientSecret === null) {
      throw new Error('PayPal clientSecret is required');
    }

    return {
      clientId,
      clientSecret,
    };
  }

  private resolvePayPalPlanId(
    dtoIn: GatewayRecurringPaymentDtoIn,
  ): string | null {
    const planConfig = this.asObject(dtoIn.subscriptionPlan.config);
    const gatewayMappings = this.asObject(planConfig.gatewayMappings);
    const paypalMapping = this.asObject(gatewayMappings.paypal);

    return (
      this.toNullableString(paypalMapping.planId) ??
      this.toNullableString(paypalMapping.gatewayPlanId) ??
      this.toNullableString(paypalMapping.paypalPlanId) ??
      this.toNullableString(dtoIn.subscriptionPlan.gatewayPlanId)
    );
  }

  private resolvePayPalProductId(
    dtoIn: GatewayRecurringPaymentDtoIn,
  ): string | null {
    const planConfig = this.asObject(dtoIn.subscriptionPlan.config);
    const gatewayMappings = this.asObject(planConfig.gatewayMappings);
    const paypalMapping = this.asObject(gatewayMappings.paypal);

    return (
      this.toNullableString(paypalMapping.productId) ??
      this.toNullableString(paypalMapping.gatewayProductId) ??
      this.toNullableString(paypalMapping.paypalProductId)
    );
  }

  private resolveBaseUrl(dtoIn: GatewayRecurringPaymentDtoIn): string {
    const apiCredentialConfig = this.asObject(dtoIn.apiCredential.config);
    const gatewayConfig = this.asObject(dtoIn.config.gatewayConfig);

    const configuredBaseUrl =
      this.toNullableString(apiCredentialConfig.baseUrl) ??
      this.toNullableString(apiCredentialConfig.base_url) ??
      this.toNullableString(gatewayConfig.baseUrl) ??
      this.toNullableString(gatewayConfig.base_url);

    if (configuredBaseUrl !== null) {
      return configuredBaseUrl.replace(/\/+$/, '');
    }

    const environment =
      this.toNullableString(apiCredentialConfig.environment) ??
      this.toNullableString(gatewayConfig.environment) ??
      'sandbox';

    if (environment === 'production' || environment === 'live') {
      return 'https://api-m.paypal.com';
    }

    return 'https://api-m.sandbox.paypal.com';
  }

  private mapPayPalInterval(interval: string): string {
    if (interval === 'day') {
      return 'DAY';
    }

    if (interval === 'week') {
      return 'WEEK';
    }

    if (interval === 'month') {
      return 'MONTH';
    }

    if (interval === 'year') {
      return 'YEAR';
    }

    throw new Error(`unsupported PayPal recurring interval: ${interval}`);
  }

  private mapPayPalSubscriptionStatus(status: string): {
    status: string;
    processStatus: string;
    processMessage: string;
  } {
    const normalized = status.toUpperCase().trim();

    if (normalized === 'ACTIVE') {
      return {
        status: 'authorized',
        processStatus: 'gateway_recurring_subscription_authorized',
        processMessage: 'PayPal recurring subscription is active',
      };
    }

    if (normalized === 'APPROVAL_PENDING') {
      return {
        status: 'pending',
        processStatus: 'gateway_recurring_subscription_approval_pending',
        processMessage:
          'PayPal recurring subscription created and waiting buyer approval',
      };
    }

    if (normalized === 'APPROVED') {
      return {
        status: 'pending',
        processStatus: 'gateway_recurring_subscription_approved',
        processMessage:
          'PayPal recurring subscription approved and waiting activation',
      };
    }

    if (normalized === 'SUSPENDED') {
      return {
        status: 'pending',
        processStatus: 'gateway_recurring_subscription_suspended',
        processMessage: 'PayPal recurring subscription suspended',
      };
    }

    if (normalized === 'CANCELLED' || normalized === 'CANCELED') {
      return {
        status: 'canceled',
        processStatus: 'gateway_recurring_subscription_canceled',
        processMessage: 'PayPal recurring subscription canceled',
      };
    }

    return {
      status: 'pending',
      processStatus: 'gateway_recurring_subscription_created',
      processMessage: `PayPal recurring subscription created with status ${status}`,
    };
  }

  private extractApprovalUrl(
    responseBody: Record<string, unknown>,
  ): string | null {
    const links = responseBody.links;

    if (!Array.isArray(links)) {
      return null;
    }

    for (const link of links) {
      const linkObject = this.asObject(link);

      const rel = this.toNullableString(linkObject.rel);
      const href = this.toNullableString(linkObject.href);

      if ((rel === 'approve' || rel === 'approval_url') && href !== null) {
        return href;
      }
    }

    return null;
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
      'paypal',

      null,
      this.resolvePayPalPlanId(params.dtoIn),
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
        provider: 'paypal',
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

  private resolvePayPalErrorMessage(
    responseBody: Record<string, unknown>,
    statusCode: number,
  ): string {
    const details = responseBody.details;

    if (Array.isArray(details) && details.length > 0) {
      const firstDetail = this.asObject(details[0]);

      const issue = this.toNullableString(firstDetail.issue);
      const description = this.toNullableString(firstDetail.description);

      if (issue !== null && description !== null) {
        return `${issue}: ${description}`;
      }

      if (description !== null) {
        return description;
      }
    }

    return (
      this.toNullableString(responseBody.message) ??
      this.toNullableString(responseBody.error_description) ??
      this.toNullableString(responseBody.error) ??
      `PayPal recurring subscription request failed with status ${statusCode}`
    );
  }

  private resolveSuccessUrl(dtoIn: GatewayRecurringPaymentDtoIn): string | null {
    const checkoutSession = this.asObject(dtoIn.providerPayload.checkoutSession);
    const apiCredentialConfig = this.asObject(dtoIn.apiCredential.config);
    const gatewayConfig = this.asObject(dtoIn.config.gatewayConfig);

    return (
      this.toNullableString(checkoutSession.successUrl) ??
      this.toNullableString(apiCredentialConfig.successUrl) ??
      this.toNullableString(apiCredentialConfig.success_url) ??
      this.toNullableString(apiCredentialConfig.returnUrl) ??
      this.toNullableString(apiCredentialConfig.return_url) ??
      this.toNullableString(gatewayConfig.successUrl) ??
      this.toNullableString(gatewayConfig.returnUrl)
    );
  }

  private resolveCancelUrl(dtoIn: GatewayRecurringPaymentDtoIn): string | null {
    const checkoutSession = this.asObject(dtoIn.providerPayload.checkoutSession);
    const apiCredentialConfig = this.asObject(dtoIn.apiCredential.config);
    const gatewayConfig = this.asObject(dtoIn.config.gatewayConfig);

    return (
      this.toNullableString(checkoutSession.cancelUrl) ??
      this.toNullableString(apiCredentialConfig.cancelUrl) ??
      this.toNullableString(apiCredentialConfig.cancel_url) ??
      this.toNullableString(gatewayConfig.cancelUrl) ??
      this.toNullableString(gatewayConfig.cancel_url)
    );
  }

  private centsToDecimal(valueInCents: number): string {
    return (valueInCents / 100).toFixed(2);
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
      'clientidsecret',
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
}
