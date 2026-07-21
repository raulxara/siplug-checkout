import { Injectable } from '@nestjs/common';
import { GatewayRecurringPaymentDtoIn } from '../../dtos/gateway-recurring-payment.dto-in';
import { GatewayRecurringPaymentDtoOut } from '../../dtos/gateway-recurring-payment.dto-out';

type PagSeguroApiResponse = {
  ok: boolean;
  status: number;
  body: Record<string, unknown>;
};

type PagSeguroResolvedCustomer = {
  ok: boolean;
  status: number;
  customer: Record<string, unknown>;
  customerId: string | null;
  requestPayload: Record<string, unknown> | Array<Record<string, unknown>> | null;
  responseBody: Record<string, unknown> | null;
  processMessage: string | null;
};

type PagSeguroNotificationPreferencesResult = {
  ok: boolean;
  status: number;
  skipped: boolean;
  notificationUrl: string | null;
  requestPayload: Record<string, unknown> | null;
  responseBody: Record<string, unknown> | null;
  processMessage: string | null;
};

@Injectable()
export class PagSeguroRecurringPaymentProvider {
  async createSubscription(
    dtoIn: GatewayRecurringPaymentDtoIn,
  ): Promise<GatewayRecurringPaymentDtoOut> {
    const providerPaymentMethod = this.mapPaymentMethod(
      dtoIn.paymentTransaction.paymentMethod,
    );

    if (providerPaymentMethod === null) {
      return this.buildFailedResponse({
        dtoIn,
        gatewayStatus: 'unsupported_payment_method',
        processMessage: `PagSeguro recurring API does not support paymentMethod: ${dtoIn.paymentTransaction.paymentMethod}. Supported methods: credit_card, boleto.`,
        providerRequest: {
          paymentMethod: dtoIn.paymentTransaction.paymentMethod,
        },
        providerResponse: {
          reason: 'unsupported_payment_method',
        },
        httpStatus: 0,
      });
    }

    const token = this.resolveProviderToken(dtoIn);

    const notificationPreferencesDtoOut =
      await this.ensureRecurringNotificationPreferences({
        dtoIn,
        token,
      });

    if (!notificationPreferencesDtoOut.ok) {
      return this.buildFailedResponse({
        dtoIn,
        gatewayStatus: String(notificationPreferencesDtoOut.status),
        processMessage:
          notificationPreferencesDtoOut.processMessage ??
          'PagSeguro recurring notification preferences configuration failed',
        providerRequest:
          notificationPreferencesDtoOut.requestPayload ?? {
            notificationUrl: notificationPreferencesDtoOut.notificationUrl,
          },
        providerResponse:
          notificationPreferencesDtoOut.responseBody ?? {
            reason: 'pagseguro_recurring_notification_url_not_configured',
          },
        httpStatus: notificationPreferencesDtoOut.status,
      });
    }

    const planDtoOut = await this.resolveOrCreatePlan({
      dtoIn,
      token,
      providerPaymentMethod,
    });

    if (!planDtoOut.ok) {
      return this.buildFailedResponse({
        dtoIn,
        gatewayStatus: String(planDtoOut.status),
        processMessage: this.resolvePagSeguroErrorMessage(
          planDtoOut.body,
          planDtoOut.status,
        ),
        providerRequest: planDtoOut.requestPayload,
        providerResponse: planDtoOut.body,
        httpStatus: planDtoOut.status,
      });
    }

    const resolvedCustomerDtoOut = await this.resolveCustomerForSubscription({
    dtoIn,
    token,
    providerPaymentMethod,
    });

    if (!resolvedCustomerDtoOut.ok) {
    return this.buildFailedResponse({
        dtoIn,
        gatewayStatus: String(resolvedCustomerDtoOut.status),
        processMessage:
        resolvedCustomerDtoOut.processMessage ??
        'PagSeguro customer resolution failed',
        providerRequest:
        Array.isArray(resolvedCustomerDtoOut.requestPayload)
            ? { billingInfo: resolvedCustomerDtoOut.requestPayload }
            : resolvedCustomerDtoOut.requestPayload,
        providerResponse: resolvedCustomerDtoOut.responseBody,
        httpStatus: resolvedCustomerDtoOut.status,
    });
    }

    const subscriptionRequest = this.buildSubscriptionRequest({
    dtoIn,
    planId: planDtoOut.planId,
    providerPaymentMethod,
    customer: resolvedCustomerDtoOut.customer,
    });

    const subscriptionResponse = await this.executePagSeguroJsonRequest({
    dtoIn,
    token,
    path: '/subscriptions',
    method: 'POST',
    requestPayload: subscriptionRequest,
    requestIdSuffix: 'subscription',
    });

    if (!subscriptionResponse.ok) {
      return this.buildFailedResponse({
        dtoIn,
        gatewayStatus: String(subscriptionResponse.status),
        processMessage: this.resolvePagSeguroErrorMessage(
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
      this.toNullableString(subscriptionResponse.body.status) ?? 'PENDING';

    const mappedStatus = this.mapPagSeguroSubscriptionStatus(gatewayStatus);

    return new GatewayRecurringPaymentDtoOut(
      true,
      'pagseguro',

      gatewaySubscriptionId,
      planDtoOut.planId,
      gatewaySubscriptionId,
      gatewaySubscriptionId,

      gatewayStatus,
      mappedStatus.status,
      mappedStatus.processStatus,
      mappedStatus.processMessage,

      this.sanitizePayload({
        notificationPreferencesRequest:
          notificationPreferencesDtoOut.requestPayload,
        notificationPreferencesResponse:
          notificationPreferencesDtoOut.responseBody,
        planRequest: planDtoOut.planRequestPayload,
        customerId: resolvedCustomerDtoOut.customerId,
        customerReused: resolvedCustomerDtoOut.customerId !== null,
        subscriptionRequest,
      }),
      this.sanitizePayload(subscriptionResponse.body),
      {
        ok: true,
        provider: 'pagseguro',
        endpoint: '/subscriptions',
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
    token: string;
    providerPaymentMethod: 'CREDIT_CARD' | 'BOLETO';
  }): Promise<{
    ok: boolean;
    status: number;
    body: Record<string, unknown>;
    planId: string;
    requestPayload: Record<string, unknown> | null;
    planRequestPayload: Record<string, unknown> | null;
  }> {
    const existingPlanId = this.resolvePagSeguroPlanId(params.dtoIn);

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

    const planRequest = this.buildPlanRequest({
      dtoIn: params.dtoIn,
      providerPaymentMethod: params.providerPaymentMethod,
    });

    const planResponse = await this.executePagSeguroJsonRequest({
      dtoIn: params.dtoIn,
      token: params.token,
      path: '/plans',
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
      'PagSeguro plan id was not returned',
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

  private buildPlanRequest(params: {
    dtoIn: GatewayRecurringPaymentDtoIn;
    providerPaymentMethod: 'CREDIT_CARD' | 'BOLETO';
  }): Record<string, unknown> {
    const dtoIn = params.dtoIn;

    const request: Record<string, unknown> = {
      reference_id: this.buildPlanReferenceId({
        subscriptionPlanId: dtoIn.subscriptionPlan._id,
        paymentMethod: params.providerPaymentMethod,
      }),
      name: this.limitText(dtoIn.subscriptionPlan.name, 65),
      description: this.limitText(
        dtoIn.subscriptionPlan.description ?? dtoIn.subscriptionPlan.name,
        250,
      ),
      amount: {
        value: dtoIn.paymentTransaction.amount,
        currency: dtoIn.paymentTransaction.currency,
      },
      interval: {
        unit: this.mapPagSeguroInterval(dtoIn.subscriptionPlan.billingInterval),
        length: dtoIn.subscriptionPlan.billingIntervalCount,
      },
      payment_method: [params.providerPaymentMethod],
      editable: true,
    };

    if (dtoIn.subscriptionPlan.maxBillingCycles !== null) {
      request.billing_cycles = dtoIn.subscriptionPlan.maxBillingCycles;
    }

    if (
      params.providerPaymentMethod === 'CREDIT_CARD' &&
      dtoIn.subscriptionPlan.trialDays !== null &&
      dtoIn.subscriptionPlan.trialDays > 0
    ) {
      request.trial = {
        days: dtoIn.subscriptionPlan.trialDays,
        enable: true,
        hold_setup_fee: true,
      };
    }

    return request;
  }

  private buildSubscriptionRequest(params: {
    dtoIn: GatewayRecurringPaymentDtoIn;
    planId: string;
    providerPaymentMethod: 'CREDIT_CARD' | 'BOLETO';
    customer: Record<string, unknown>;
    }): Record<string, unknown> {
    const dtoIn = params.dtoIn;
    const paymentData = this.asObject(dtoIn.providerPayload.paymentData);

    const request: Record<string, unknown> = {
        reference_id: this.limitText(
        dtoIn.paymentTransaction._id.replace(/[^a-zA-Z0-9]/g, ''),
        65,
        ),
        plan: {
        id: params.planId,
        },
        customer: params.customer,
        payment_method: this.buildPaymentMethodObject({
        paymentData,
        providerPaymentMethod: params.providerPaymentMethod,
        }),
        amount: {
        value: dtoIn.paymentTransaction.amount,
        currency: dtoIn.paymentTransaction.currency,
        },
        pro_rata: false,
    };

    return request;
    }

    private async resolveCustomerForSubscription(params: {
    dtoIn: GatewayRecurringPaymentDtoIn;
    token: string;
    providerPaymentMethod: 'CREDIT_CARD' | 'BOLETO';
    }): Promise<PagSeguroResolvedCustomer> {
    const payer = this.asObject(params.dtoIn.providerPayload.payer);
    const paymentData = this.asObject(params.dtoIn.providerPayload.paymentData);

    const taxId = this.onlyDigits(
        this.toRequiredString(
        payer.documentValue,
        'payer.documentValue is required for PagSeguro recurring payment',
        ),
    );

    const existingCustomerDtoOut = await this.findCustomerByTaxId({
        dtoIn: params.dtoIn,
        token: params.token,
        taxId,
    });

    if (!existingCustomerDtoOut.ok) {
        return {
        ok: false,
        status: existingCustomerDtoOut.status,
        customer: {},
        customerId: null,
        requestPayload: null,
        responseBody: existingCustomerDtoOut.body,
        processMessage: this.resolvePagSeguroErrorMessage(
            existingCustomerDtoOut.body,
            existingCustomerDtoOut.status,
        ),
        };
    }

    const existingCustomerId = this.extractFirstCustomerId(
        existingCustomerDtoOut.body,
    );

    if (existingCustomerId !== null) {
        if (params.providerPaymentMethod === 'CREDIT_CARD') {
        const updateBillingInfoDtoOut =
            await this.updateCustomerBillingInfoForCreditCard({
            dtoIn: params.dtoIn,
            token: params.token,
            customerId: existingCustomerId,
            paymentData,
            });

        if (!updateBillingInfoDtoOut.ok) {
            return {
            ok: false,
            status: updateBillingInfoDtoOut.status,
            customer: {},
            customerId: existingCustomerId,
            requestPayload: updateBillingInfoDtoOut.requestPayload,
            responseBody: updateBillingInfoDtoOut.body,
            processMessage: this.resolvePagSeguroErrorMessage(
                updateBillingInfoDtoOut.body,
                updateBillingInfoDtoOut.status,
            ),
            };
        }
        }

        return {
        ok: true,
        status: 200,
        customer: {
            id: existingCustomerId,
        },
        customerId: existingCustomerId,
        requestPayload: null,
        responseBody: existingCustomerDtoOut.body,
        processMessage: null,
        };
    }

    return {
        ok: true,
        status: 200,
        customer: this.buildCustomerObject({
        payer,
        paymentData,
        providerPaymentMethod: params.providerPaymentMethod,
        }),
        customerId: null,
        requestPayload: null,
        responseBody: existingCustomerDtoOut.body,
        processMessage: null,
    };
    }

    private async findCustomerByTaxId(params: {
    dtoIn: GatewayRecurringPaymentDtoIn;
    token: string;
    taxId: string;
    }): Promise<PagSeguroApiResponse> {
    const baseUrl = this.resolveBaseUrl(params.dtoIn);

    const url = new URL(`${baseUrl}/customers`);
    url.searchParams.set('offset', '0');
    url.searchParams.set('limit', '1');

    const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${params.token}`,
        q: params.taxId,
        },
    });

    const body = await this.parseJsonResponse(
        response,
        'PagSeguro returned a non JSON response for /customers',
    );

    return {
        ok: response.ok,
        status: response.status,
        body,
    };
    }

    private async updateCustomerBillingInfoForCreditCard(params: {
    dtoIn: GatewayRecurringPaymentDtoIn;
    token: string;
    customerId: string;
    paymentData: Record<string, unknown>;
    }): Promise<
    PagSeguroApiResponse & {
        requestPayload: Array<Record<string, unknown>>;
    }
    > {
    const encryptedCard =
        this.toNullableString(params.paymentData.encryptedCard) ??
        this.toNullableString(params.paymentData.encrypted_card) ??
        this.toNullableString(this.asObject(params.paymentData.card).encrypted);

    if (encryptedCard === null) {
        throw new Error(
        'paymentData.encryptedCard is required for PagSeguro recurring credit_card payment',
        );
    }

    const requestPayload = [
        {
        type: 'CREDIT_CARD',
        card: {
            encrypted: encryptedCard,
        },
        },
    ];

    const baseUrl = this.resolveBaseUrl(params.dtoIn);

    const requestId =
        params.dtoIn.idempotencyKey ??
        params.dtoIn.paymentTransaction.idempotencyKey ??
        params.dtoIn.paymentTransaction._id;

    const response = await fetch(
        `${baseUrl}/customers/${params.customerId}/billing_info`,
        {
        method: 'PUT',
        headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${params.token}`,
            'Content-Type': 'application/json',
            'x-idempotency-key': this.normalizeIdempotencyKey(
            `${requestId}-billing-info`,
            ),
        },
        body: JSON.stringify(requestPayload),
        },
    );

    const body = await this.parseJsonResponse(
        response,
        `PagSeguro returned a non JSON response for /customers/${params.customerId}/billing_info`,
    );

    return {
        ok: response.ok,
        status: response.status,
        body,
        requestPayload,
    };
    }

    private extractFirstCustomerId(
    responseBody: Record<string, unknown>,
    ): string | null {
    const directId = this.toNullableString(responseBody.id);

    if (directId !== null && directId.startsWith('CUST_')) {
        return directId;
    }

    const possibleCollections = [
        responseBody.customers,
        responseBody.data,
        responseBody.items,
        responseBody.results,
    ];

    for (const collection of possibleCollections) {
        if (!Array.isArray(collection) || collection.length === 0) {
        continue;
        }

        const firstItem = this.asObject(collection[0]);
        const id = this.toNullableString(firstItem.id);

        if (id !== null && id.startsWith('CUST_')) {
        return id;
        }
    }

    return null;
    }

  private buildPlanReferenceId(params: {
    subscriptionPlanId: string;
    paymentMethod: 'CREDIT_CARD' | 'BOLETO';
  }): string {
    return this.limitText(
        `${params.subscriptionPlanId}-${params.paymentMethod}`
        .replace(/[^a-zA-Z0-9]/g, ''),
        65,
    );
  }

  private buildCustomerObject(params: {
    payer: Record<string, unknown>;
    paymentData: Record<string, unknown>;
    providerPaymentMethod: 'CREDIT_CARD' | 'BOLETO';
  }): Record<string, unknown> {
    const name = this.toRequiredString(
      params.payer.name,
      'payer.name is required for PagSeguro recurring payment',
    );

    const email = this.toRequiredString(
      params.payer.email,
      'payer.email is required for PagSeguro recurring payment',
    );

    const taxId = this.onlyDigits(
      this.toRequiredString(
        params.payer.documentValue,
        'payer.documentValue is required for PagSeguro recurring payment',
      ),
    );

    const customer: Record<string, unknown> = {
      reference_id: this.limitText(
        this.toNullableString(params.payer.referenceId) ??
          taxId ??
          `customer-${Date.now()}`,
        65,
      ),
      name: this.limitText(name, 150),
      email: this.limitText(email, 60),
      tax_id: taxId,
      phones: [this.buildPhoneObject(params.payer)],
      birth_date:
        this.toNullableString(params.payer.birthDate) ??
        this.toNullableString(params.payer.birth_date) ??
        '2000-01-01',
      address: this.buildAddressObject(params.payer),
    };

    if (params.providerPaymentMethod === 'CREDIT_CARD') {
      const encryptedCard =
        this.toNullableString(params.paymentData.encryptedCard) ??
        this.toNullableString(params.paymentData.encrypted_card) ??
        this.toNullableString(this.asObject(params.paymentData.card).encrypted);

      if (encryptedCard === null) {
        throw new Error(
          'paymentData.encryptedCard is required for PagSeguro recurring credit_card payment',
        );
      }

      customer.billing_info = [
        {
          type: 'CREDIT_CARD',
          card: {
            encrypted: encryptedCard,
          },
        },
      ];
    }

    return customer;
  }

  private buildPaymentMethodObject(params: {
    paymentData: Record<string, unknown>;
    providerPaymentMethod: 'CREDIT_CARD' | 'BOLETO';
  }): Array<Record<string, unknown>> {
    if (params.providerPaymentMethod === 'BOLETO') {
      return [
        {
          type: 'BOLETO',
        },
      ];
    }

    const securityCode =
      this.toNullableString(params.paymentData.securityCode) ??
      this.toNullableString(params.paymentData.security_code) ??
      this.toNullableString(params.paymentData.cvv);

    if (securityCode === null) {
      throw new Error(
        'paymentData.securityCode is required for PagSeguro recurring credit_card payment',
      );
    }

    return [
      {
        type: 'CREDIT_CARD',
        card: {
          security_code: securityCode,
        },
      },
    ];
  }

  private buildPhoneObject(
    payer: Record<string, unknown>,
  ): Record<string, unknown> {
    const phone = this.asObject(payer.phone);

    const country =
      this.onlyDigits(this.toNullableString(phone.country) ?? '') || '55';

    const area =
      this.onlyDigits(
        this.toNullableString(phone.area) ??
          this.toNullableString(phone.areaCode) ??
          this.toNullableString(phone.area_code) ??
          this.toNullableString(payer.phoneArea) ??
          '',
      ) || '11';

    const number =
      this.onlyDigits(
        this.toNullableString(phone.number) ??
          this.toNullableString(payer.phoneNumber) ??
          this.toNullableString(payer.phone_number) ??
          '',
      ) || '999999999';

    return {
      country,
      area,
      number,
      type: 'MOBILE',
    };
  }

  private buildAddressObject(
    payer: Record<string, unknown>,
  ): Record<string, unknown> {
    const address = this.asObject(payer.address);

    return {
      street:
        this.toNullableString(address.street) ??
        this.toNullableString(address.streetName) ??
        'Rua Teste',
      number:
        this.toNullableString(address.number) ??
        this.toNullableString(address.streetNumber) ??
        '100',
      complement: this.toNullableString(address.complement) ?? 'N/A',
      locality:
        this.toNullableString(address.locality) ??
        this.toNullableString(address.neighborhood) ??
        'Centro',
      city: this.toNullableString(address.city) ?? 'Sao Paulo',
      region_code:
        this.toNullableString(address.regionCode) ??
        this.toNullableString(address.region_code) ??
        this.toNullableString(address.state) ??
        'SP',
      country: this.toNullableString(address.country) ?? 'BRA',
      postal_code:
        this.onlyDigits(
          this.toNullableString(address.postalCode) ??
            this.toNullableString(address.postal_code) ??
            '',
        ) || '01001000',
    };
  }

  private async executePagSeguroJsonRequest(params: {
    dtoIn: GatewayRecurringPaymentDtoIn;
    token: string;
    path: string;
    method: 'POST' | 'GET' | 'PUT' | 'PATCH';
    requestPayload: Record<string, unknown>;
    requestIdSuffix: string;
  }): Promise<PagSeguroApiResponse> {
    const baseUrl = this.resolveBaseUrl(params.dtoIn);

    const requestId =
      params.dtoIn.idempotencyKey ??
      params.dtoIn.paymentTransaction.idempotencyKey ??
      params.dtoIn.paymentTransaction._id;

    const response = await fetch(`${baseUrl}${params.path}`, {
      method: params.method,
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${params.token}`,
        'Content-Type': 'application/json',
        'x-idempotency-key': this.normalizeIdempotencyKey(
          `${requestId}-${params.requestIdSuffix}`,
        ),
      },
      body: JSON.stringify(params.requestPayload),
    });

    const body = await this.parseJsonResponse(
      response,
      `PagSeguro returned a non JSON response for ${params.path}`,
    );

    return {
      ok: response.ok,
      status: response.status,
      body,
    };
  }

  private mapPaymentMethod(
    paymentMethod: string,
  ): 'CREDIT_CARD' | 'BOLETO' | null {
    if (paymentMethod === 'credit_card' || paymentMethod === 'card') {
      return 'CREDIT_CARD';
    }

    if (paymentMethod === 'boleto') {
      return 'BOLETO';
    }

    return null;
  }

  private mapPagSeguroInterval(interval: string): string {
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

    throw new Error(`unsupported PagSeguro recurring interval: ${interval}`);
  }

  private mapPagSeguroSubscriptionStatus(status: string): {
    status: string;
    processStatus: string;
    processMessage: string;
  } {
    const normalized = status.toUpperCase().trim();

    if (normalized === 'ACTIVE' || normalized === 'TRIAL') {
      return {
        status: 'authorized',
        processStatus: 'gateway_recurring_subscription_authorized',
        processMessage: `PagSeguro recurring subscription created with status ${normalized}`,
      };
    }

    if (
      normalized === 'PENDING' ||
      normalized === 'PENDING_ACTION' ||
      normalized === 'OVERDUE' ||
      normalized === 'SUSPENDED'
    ) {
      return {
        status: 'pending',
        processStatus: 'gateway_recurring_subscription_pending',
        processMessage: `PagSeguro recurring subscription created with status ${normalized}`,
      };
    }

    if (normalized === 'CANCELED' || normalized === 'CANCELLED') {
      return {
        status: 'canceled',
        processStatus: 'gateway_recurring_subscription_canceled',
        processMessage: 'PagSeguro recurring subscription canceled',
      };
    }

    if (normalized === 'EXPIRED') {
      return {
        status: 'expired',
        processStatus: 'gateway_recurring_subscription_expired',
        processMessage: 'PagSeguro recurring subscription expired',
      };
    }

    return {
      status: 'pending',
      processStatus: 'gateway_recurring_subscription_created',
      processMessage: `PagSeguro recurring subscription created with status ${status}`,
    };
  }

  private resolvePagSeguroPlanId(
    dtoIn: GatewayRecurringPaymentDtoIn,
  ): string | null {
    const planConfig = this.asObject(dtoIn.subscriptionPlan.config);
    const gatewayMappings = this.asObject(planConfig.gatewayMappings);
    const pagSeguroMapping =
      this.asObject(gatewayMappings.pagseguro).id !== undefined
        ? this.asObject(gatewayMappings.pagseguro)
        : this.asObject(gatewayMappings.pagbank);

    return (
      this.toNullableString(pagSeguroMapping.planId) ??
      this.toNullableString(pagSeguroMapping.gatewayPlanId) ??
      this.toNullableString(pagSeguroMapping.pagSeguroPlanId) ??
      this.toNullableString(pagSeguroMapping.pagbankPlanId) ??
      this.toNullableString(dtoIn.subscriptionPlan.gatewayPlanId)
    );
  }

  private resolveProviderToken(dtoIn: GatewayRecurringPaymentDtoIn): string {
    const token =
      this.toNullableString(dtoIn.apiCredential.token) ??
      this.toNullableString(dtoIn.apiCredential.connectionData?.token);

    if (token === null) {
      throw new Error('PagSeguro provider token is required');
    }

    return token;
  }

  private resolveBaseUrl(dtoIn: GatewayRecurringPaymentDtoIn): string {
    const apiCredentialConfig = this.asObject(dtoIn.apiCredential.config);
    const gatewayConfig = this.asObject(dtoIn.config.gatewayConfig);

    const configuredRecurringBaseUrl =
        this.toNullableString(apiCredentialConfig.recurringBaseUrl) ??
        this.toNullableString(apiCredentialConfig.recurring_base_url) ??
        this.toNullableString(gatewayConfig.recurringBaseUrl) ??
        this.toNullableString(gatewayConfig.recurring_base_url);

    if (configuredRecurringBaseUrl !== null) {
        return configuredRecurringBaseUrl.replace(/\/+$/, '');
    }

    const environment =
        this.toNullableString(apiCredentialConfig.environment) ??
        this.toNullableString(gatewayConfig.environment) ??
        'sandbox';

    if (environment === 'production' || environment === 'live') {
        return 'https://api.assinaturas.pagseguro.com';
    }

    return 'https://sandbox.api.assinaturas.pagseguro.com';
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
      'pagseguro',

      null,
      this.resolvePagSeguroPlanId(params.dtoIn),
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
        provider: 'pagseguro',
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

  private resolvePagSeguroErrorMessage(
    responseBody: Record<string, unknown>,
    statusCode: number,
    ): string {
    const errorMessages = responseBody.error_messages;

    if (Array.isArray(errorMessages) && errorMessages.length > 0) {
        const firstError = this.asObject(errorMessages[0]);

        const error = this.toNullableString(firstError.error);
        const description = this.toNullableString(firstError.description);
        const parameterName = this.toNullableString(firstError.parameter_name);

        if (error !== null && description !== null && parameterName !== null) {
        return `${error}: ${description} (${parameterName})`;
        }

        if (error !== null && description !== null) {
        return `${error}: ${description}`;
        }

        if (description !== null) {
        return description;
        }
    }

    const errors = responseBody.errors;

    if (Array.isArray(errors) && errors.length > 0) {
        const firstError = this.asObject(errors[0]);

        const code = this.toNullableString(firstError.code);
        const description =
        this.toNullableString(firstError.description) ??
        this.toNullableString(firstError.message);

        if (code !== null && description !== null) {
        return `${code}: ${description}`;
        }

        if (description !== null) {
        return description;
        }
    }

    return (
        this.toNullableString(responseBody.message) ??
        this.toNullableString(responseBody.error_description) ??
        this.toNullableString(responseBody.error) ??
        `PagSeguro recurring subscription request failed with status ${statusCode}`
    );
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

    if (
      !sanitized ||
      typeof sanitized !== 'object' ||
      Array.isArray(sanitized)
    ) {
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
      'secret',
      'password',
      'card',
      'cardnumber',
      'cardtoken',
      'encryptedcard',
      'encrypted',
      'cvv',
      'securitycode',
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

  private async ensureRecurringNotificationPreferences(params: {
    dtoIn: GatewayRecurringPaymentDtoIn;
    token: string;
  }): Promise<PagSeguroNotificationPreferencesResult> {
    const notificationUrl = this.resolveRecurringNotificationUrl(params.dtoIn);

    if (notificationUrl === null) {
      return {
        ok: false,
        status: 0,
        skipped: true,
        notificationUrl: null,
        requestPayload: null,
        responseBody: {
          reason: 'notification_url_not_configured',
          message:
            'PagSeguro recurring webhook requires notification preferences URL',
        },
        processMessage:
          'PagSeguro recurring notificationUrl is required to receive subscription webhooks',
      };
    }

    const requestPayload = {
      urls: [notificationUrl],
    };

    const response = await this.executePagSeguroJsonRequest({
      dtoIn: params.dtoIn,
      token: params.token,
      path: '/preferences/notifications',
      method: 'PUT',
      requestPayload,
      requestIdSuffix: 'notification-preferences',
    });

    return {
      ok: response.ok,
      status: response.status,
      skipped: false,
      notificationUrl,
      requestPayload,
      responseBody: response.body,
      processMessage: response.ok
        ? null
        : this.resolvePagSeguroErrorMessage(response.body, response.status),
    };
  }

  private resolveRecurringNotificationUrl(
    dtoIn: GatewayRecurringPaymentDtoIn,
  ): string | null {
    const config = dtoIn.config ?? {};
    const transactionConfig = this.asObject(config.transactionConfig);
    const gatewayConfig = this.asObject(config.gatewayConfig);
    const apiCredentialConfig = this.asObject(config.apiCredentialConfig);

    return (
      this.toNullableString(transactionConfig.recurringNotificationUrl) ??
      this.toNullableString(transactionConfig.recurring_notification_url) ??
      this.toNullableString(transactionConfig.subscriptionNotificationUrl) ??
      this.toNullableString(transactionConfig.subscription_notification_url) ??
      this.toNullableString(transactionConfig.notificationUrl) ??
      this.toNullableString(transactionConfig.notification_url) ??
      this.toNullableString(gatewayConfig.recurringNotificationUrl) ??
      this.toNullableString(gatewayConfig.recurring_notification_url) ??
      this.toNullableString(gatewayConfig.subscriptionNotificationUrl) ??
      this.toNullableString(gatewayConfig.subscription_notification_url) ??
      this.toNullableString(gatewayConfig.notificationUrl) ??
      this.toNullableString(gatewayConfig.notification_url) ??
      this.toNullableString(apiCredentialConfig.recurringNotificationUrl) ??
      this.toNullableString(apiCredentialConfig.recurring_notification_url) ??
      this.toNullableString(apiCredentialConfig.subscriptionNotificationUrl) ??
      this.toNullableString(apiCredentialConfig.subscription_notification_url) ??
      this.toNullableString(apiCredentialConfig.notificationUrl) ??
      this.toNullableString(apiCredentialConfig.notification_url)
    );
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
