"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PagSeguroRecurringPaymentProvider = void 0;
const common_1 = require("@nestjs/common");
const gateway_recurring_payment_dto_out_1 = require("../../dtos/gateway-recurring-payment.dto-out");
let PagSeguroRecurringPaymentProvider = class PagSeguroRecurringPaymentProvider {
    async createSubscription(dtoIn) {
        const providerPaymentMethod = this.mapPaymentMethod(dtoIn.paymentTransaction.paymentMethod);
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
        const notificationPreferencesDtoOut = await this.ensureRecurringNotificationPreferences({
            dtoIn,
            token,
        });
        if (!notificationPreferencesDtoOut.ok) {
            return this.buildFailedResponse({
                dtoIn,
                gatewayStatus: String(notificationPreferencesDtoOut.status),
                processMessage: notificationPreferencesDtoOut.processMessage ??
                    'PagSeguro recurring notification preferences configuration failed',
                providerRequest: notificationPreferencesDtoOut.requestPayload ?? {
                    notificationUrl: notificationPreferencesDtoOut.notificationUrl,
                },
                providerResponse: notificationPreferencesDtoOut.responseBody ?? {
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
                processMessage: this.resolvePagSeguroErrorMessage(planDtoOut.body, planDtoOut.status),
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
                processMessage: resolvedCustomerDtoOut.processMessage ??
                    'PagSeguro customer resolution failed',
                providerRequest: Array.isArray(resolvedCustomerDtoOut.requestPayload)
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
                processMessage: this.resolvePagSeguroErrorMessage(subscriptionResponse.body, subscriptionResponse.status),
                providerRequest: subscriptionRequest,
                providerResponse: subscriptionResponse.body,
                httpStatus: subscriptionResponse.status,
            });
        }
        const gatewaySubscriptionId = this.toNullableString(subscriptionResponse.body.id);
        const gatewayStatus = this.toNullableString(subscriptionResponse.body.status) ?? 'PENDING';
        const mappedStatus = this.mapPagSeguroSubscriptionStatus(gatewayStatus);
        return new gateway_recurring_payment_dto_out_1.GatewayRecurringPaymentDtoOut(true, 'pagseguro', gatewaySubscriptionId, planDtoOut.planId, gatewaySubscriptionId, gatewaySubscriptionId, gatewayStatus, mappedStatus.status, mappedStatus.processStatus, mappedStatus.processMessage, this.sanitizePayload({
            notificationPreferencesRequest: notificationPreferencesDtoOut.requestPayload,
            notificationPreferencesResponse: notificationPreferencesDtoOut.responseBody,
            planRequest: planDtoOut.planRequestPayload,
            customerId: resolvedCustomerDtoOut.customerId,
            customerReused: resolvedCustomerDtoOut.customerId !== null,
            subscriptionRequest,
        }), this.sanitizePayload(subscriptionResponse.body), {
            ok: true,
            provider: 'pagseguro',
            endpoint: '/subscriptions',
            httpStatus: subscriptionResponse.status,
            planId: planDtoOut.planId,
        }, null, null, null, null, null, null, mappedStatus.status === 'authorized' ? this.nowAsIso() : null, null, null, null, dtoIn.paymentTransaction.expiresAt);
    }
    async resolveOrCreatePlan(params) {
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
        const planId = this.toRequiredString(planResponse.body.id, 'PagSeguro plan id was not returned');
        return {
            ok: true,
            status: planResponse.status,
            body: planResponse.body,
            planId,
            requestPayload: null,
            planRequestPayload: planRequest,
        };
    }
    buildPlanRequest(params) {
        const dtoIn = params.dtoIn;
        const request = {
            reference_id: this.buildPlanReferenceId({
                subscriptionPlanId: dtoIn.subscriptionPlan._id,
                paymentMethod: params.providerPaymentMethod,
            }),
            name: this.limitText(dtoIn.subscriptionPlan.name, 65),
            description: this.limitText(dtoIn.subscriptionPlan.description ?? dtoIn.subscriptionPlan.name, 250),
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
        if (params.providerPaymentMethod === 'CREDIT_CARD' &&
            dtoIn.subscriptionPlan.trialDays !== null &&
            dtoIn.subscriptionPlan.trialDays > 0) {
            request.trial = {
                days: dtoIn.subscriptionPlan.trialDays,
                enable: true,
                hold_setup_fee: true,
            };
        }
        return request;
    }
    buildSubscriptionRequest(params) {
        const dtoIn = params.dtoIn;
        const paymentData = this.asObject(dtoIn.providerPayload.paymentData);
        const request = {
            reference_id: this.limitText(dtoIn.paymentTransaction._id.replace(/[^a-zA-Z0-9]/g, ''), 65),
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
    async resolveCustomerForSubscription(params) {
        const payer = this.asObject(params.dtoIn.providerPayload.payer);
        const paymentData = this.asObject(params.dtoIn.providerPayload.paymentData);
        const taxId = this.onlyDigits(this.toRequiredString(payer.documentValue, 'payer.documentValue is required for PagSeguro recurring payment'));
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
                processMessage: this.resolvePagSeguroErrorMessage(existingCustomerDtoOut.body, existingCustomerDtoOut.status),
            };
        }
        const existingCustomerId = this.extractFirstCustomerId(existingCustomerDtoOut.body);
        if (existingCustomerId !== null) {
            if (params.providerPaymentMethod === 'CREDIT_CARD') {
                const updateBillingInfoDtoOut = await this.updateCustomerBillingInfoForCreditCard({
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
                        processMessage: this.resolvePagSeguroErrorMessage(updateBillingInfoDtoOut.body, updateBillingInfoDtoOut.status),
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
    async findCustomerByTaxId(params) {
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
        const body = await this.parseJsonResponse(response, 'PagSeguro returned a non JSON response for /customers');
        return {
            ok: response.ok,
            status: response.status,
            body,
        };
    }
    async updateCustomerBillingInfoForCreditCard(params) {
        const encryptedCard = this.toNullableString(params.paymentData.encryptedCard) ??
            this.toNullableString(params.paymentData.encrypted_card) ??
            this.toNullableString(this.asObject(params.paymentData.card).encrypted);
        if (encryptedCard === null) {
            throw new Error('paymentData.encryptedCard is required for PagSeguro recurring credit_card payment');
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
        const requestId = params.dtoIn.idempotencyKey ??
            params.dtoIn.paymentTransaction.idempotencyKey ??
            params.dtoIn.paymentTransaction._id;
        const response = await fetch(`${baseUrl}/customers/${params.customerId}/billing_info`, {
            method: 'PUT',
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${params.token}`,
                'Content-Type': 'application/json',
                'x-idempotency-key': this.normalizeIdempotencyKey(`${requestId}-billing-info`),
            },
            body: JSON.stringify(requestPayload),
        });
        const body = await this.parseJsonResponse(response, `PagSeguro returned a non JSON response for /customers/${params.customerId}/billing_info`);
        return {
            ok: response.ok,
            status: response.status,
            body,
            requestPayload,
        };
    }
    extractFirstCustomerId(responseBody) {
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
    buildPlanReferenceId(params) {
        return this.limitText(`${params.subscriptionPlanId}-${params.paymentMethod}`
            .replace(/[^a-zA-Z0-9]/g, ''), 65);
    }
    buildCustomerObject(params) {
        const name = this.toRequiredString(params.payer.name, 'payer.name is required for PagSeguro recurring payment');
        const email = this.toRequiredString(params.payer.email, 'payer.email is required for PagSeguro recurring payment');
        const taxId = this.onlyDigits(this.toRequiredString(params.payer.documentValue, 'payer.documentValue is required for PagSeguro recurring payment'));
        const customer = {
            reference_id: this.limitText(this.toNullableString(params.payer.referenceId) ??
                taxId ??
                `customer-${Date.now()}`, 65),
            name: this.limitText(name, 150),
            email: this.limitText(email, 60),
            tax_id: taxId,
            phones: [this.buildPhoneObject(params.payer)],
            birth_date: this.toNullableString(params.payer.birthDate) ??
                this.toNullableString(params.payer.birth_date) ??
                '2000-01-01',
            address: this.buildAddressObject(params.payer),
        };
        if (params.providerPaymentMethod === 'CREDIT_CARD') {
            const encryptedCard = this.toNullableString(params.paymentData.encryptedCard) ??
                this.toNullableString(params.paymentData.encrypted_card) ??
                this.toNullableString(this.asObject(params.paymentData.card).encrypted);
            if (encryptedCard === null) {
                throw new Error('paymentData.encryptedCard is required for PagSeguro recurring credit_card payment');
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
    buildPaymentMethodObject(params) {
        if (params.providerPaymentMethod === 'BOLETO') {
            return [
                {
                    type: 'BOLETO',
                },
            ];
        }
        const securityCode = this.toNullableString(params.paymentData.securityCode) ??
            this.toNullableString(params.paymentData.security_code) ??
            this.toNullableString(params.paymentData.cvv);
        if (securityCode === null) {
            throw new Error('paymentData.securityCode is required for PagSeguro recurring credit_card payment');
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
    buildPhoneObject(payer) {
        const phone = this.asObject(payer.phone);
        const country = this.onlyDigits(this.toNullableString(phone.country) ?? '') || '55';
        const area = this.onlyDigits(this.toNullableString(phone.area) ??
            this.toNullableString(phone.areaCode) ??
            this.toNullableString(phone.area_code) ??
            this.toNullableString(payer.phoneArea) ??
            '') || '11';
        const number = this.onlyDigits(this.toNullableString(phone.number) ??
            this.toNullableString(payer.phoneNumber) ??
            this.toNullableString(payer.phone_number) ??
            '') || '999999999';
        return {
            country,
            area,
            number,
            type: 'MOBILE',
        };
    }
    buildAddressObject(payer) {
        const address = this.asObject(payer.address);
        return {
            street: this.toNullableString(address.street) ??
                this.toNullableString(address.streetName) ??
                'Rua Teste',
            number: this.toNullableString(address.number) ??
                this.toNullableString(address.streetNumber) ??
                '100',
            complement: this.toNullableString(address.complement) ?? 'N/A',
            locality: this.toNullableString(address.locality) ??
                this.toNullableString(address.neighborhood) ??
                'Centro',
            city: this.toNullableString(address.city) ?? 'Sao Paulo',
            region_code: this.toNullableString(address.regionCode) ??
                this.toNullableString(address.region_code) ??
                this.toNullableString(address.state) ??
                'SP',
            country: this.toNullableString(address.country) ?? 'BRA',
            postal_code: this.onlyDigits(this.toNullableString(address.postalCode) ??
                this.toNullableString(address.postal_code) ??
                '') || '01001000',
        };
    }
    async executePagSeguroJsonRequest(params) {
        const baseUrl = this.resolveBaseUrl(params.dtoIn);
        const requestId = params.dtoIn.idempotencyKey ??
            params.dtoIn.paymentTransaction.idempotencyKey ??
            params.dtoIn.paymentTransaction._id;
        const response = await fetch(`${baseUrl}${params.path}`, {
            method: params.method,
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${params.token}`,
                'Content-Type': 'application/json',
                'x-idempotency-key': this.normalizeIdempotencyKey(`${requestId}-${params.requestIdSuffix}`),
            },
            body: JSON.stringify(params.requestPayload),
        });
        const body = await this.parseJsonResponse(response, `PagSeguro returned a non JSON response for ${params.path}`);
        return {
            ok: response.ok,
            status: response.status,
            body,
        };
    }
    mapPaymentMethod(paymentMethod) {
        if (paymentMethod === 'credit_card' || paymentMethod === 'card') {
            return 'CREDIT_CARD';
        }
        if (paymentMethod === 'boleto') {
            return 'BOLETO';
        }
        return null;
    }
    mapPagSeguroInterval(interval) {
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
    mapPagSeguroSubscriptionStatus(status) {
        const normalized = status.toUpperCase().trim();
        if (normalized === 'ACTIVE' || normalized === 'TRIAL') {
            return {
                status: 'authorized',
                processStatus: 'gateway_recurring_subscription_authorized',
                processMessage: `PagSeguro recurring subscription created with status ${normalized}`,
            };
        }
        if (normalized === 'PENDING' ||
            normalized === 'PENDING_ACTION' ||
            normalized === 'OVERDUE' ||
            normalized === 'SUSPENDED') {
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
    resolvePagSeguroPlanId(dtoIn) {
        const planConfig = this.asObject(dtoIn.subscriptionPlan.config);
        const gatewayMappings = this.asObject(planConfig.gatewayMappings);
        const pagSeguroMapping = this.asObject(gatewayMappings.pagseguro).id !== undefined
            ? this.asObject(gatewayMappings.pagseguro)
            : this.asObject(gatewayMappings.pagbank);
        return (this.toNullableString(pagSeguroMapping.planId) ??
            this.toNullableString(pagSeguroMapping.gatewayPlanId) ??
            this.toNullableString(pagSeguroMapping.pagSeguroPlanId) ??
            this.toNullableString(pagSeguroMapping.pagbankPlanId) ??
            this.toNullableString(dtoIn.subscriptionPlan.gatewayPlanId));
    }
    resolveProviderToken(dtoIn) {
        const token = this.toNullableString(dtoIn.apiCredential.token) ??
            this.toNullableString(dtoIn.apiCredential.connectionData?.token);
        if (token === null) {
            throw new Error('PagSeguro provider token is required');
        }
        return token;
    }
    resolveBaseUrl(dtoIn) {
        const apiCredentialConfig = this.asObject(dtoIn.apiCredential.config);
        const gatewayConfig = this.asObject(dtoIn.config.gatewayConfig);
        const configuredRecurringBaseUrl = this.toNullableString(apiCredentialConfig.recurringBaseUrl) ??
            this.toNullableString(apiCredentialConfig.recurring_base_url) ??
            this.toNullableString(gatewayConfig.recurringBaseUrl) ??
            this.toNullableString(gatewayConfig.recurring_base_url);
        if (configuredRecurringBaseUrl !== null) {
            return configuredRecurringBaseUrl.replace(/\/+$/, '');
        }
        const environment = this.toNullableString(apiCredentialConfig.environment) ??
            this.toNullableString(gatewayConfig.environment) ??
            'sandbox';
        if (environment === 'production' || environment === 'live') {
            return 'https://api.assinaturas.pagseguro.com';
        }
        return 'https://sandbox.api.assinaturas.pagseguro.com';
    }
    buildFailedResponse(params) {
        return new gateway_recurring_payment_dto_out_1.GatewayRecurringPaymentDtoOut(false, 'pagseguro', null, this.resolvePagSeguroPlanId(params.dtoIn), null, null, params.gatewayStatus, 'failed', 'gateway_recurring_provider_failed', params.processMessage, this.sanitizePayload(params.providerRequest), this.sanitizePayload(params.providerResponse), {
            ok: false,
            provider: 'pagseguro',
            httpStatus: params.httpStatus,
        }, null, null);
    }
    async parseJsonResponse(response, fallbackMessage) {
        const rawText = await response.text();
        if (rawText.trim() === '') {
            return {
                message: `${fallbackMessage}: empty response`,
                statusCode: response.status,
            };
        }
        try {
            const parsed = JSON.parse(rawText);
            if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
                return parsed;
            }
            return {
                message: fallbackMessage,
                rawResponse: rawText,
                statusCode: response.status,
            };
        }
        catch {
            return {
                message: fallbackMessage,
                rawResponse: rawText.slice(0, 2000),
                statusCode: response.status,
            };
        }
    }
    resolvePagSeguroErrorMessage(responseBody, statusCode) {
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
            const description = this.toNullableString(firstError.description) ??
                this.toNullableString(firstError.message);
            if (code !== null && description !== null) {
                return `${code}: ${description}`;
            }
            if (description !== null) {
                return description;
            }
        }
        return (this.toNullableString(responseBody.message) ??
            this.toNullableString(responseBody.error_description) ??
            this.toNullableString(responseBody.error) ??
            `PagSeguro recurring subscription request failed with status ${statusCode}`);
    }
    normalizeIdempotencyKey(value) {
        return value.replace(/[^a-zA-Z0-9]/g, '').slice(0, 200);
    }
    onlyDigits(value) {
        if (value === null) {
            return '';
        }
        return value.replace(/\D/g, '');
    }
    sanitizePayload(payload) {
        if (payload === null) {
            return null;
        }
        const sanitized = this.sanitizeUnknownValue(payload);
        if (!sanitized ||
            typeof sanitized !== 'object' ||
            Array.isArray(sanitized)) {
            return null;
        }
        return sanitized;
    }
    sanitizeUnknownValue(value) {
        if (Array.isArray(value)) {
            return value.map((item) => this.sanitizeUnknownValue(item));
        }
        if (value && typeof value === 'object') {
            const output = {};
            for (const [key, itemValue] of Object.entries(value)) {
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
    isSensitiveKey(key) {
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
    asObject(value) {
        if (!value || typeof value !== 'object' || Array.isArray(value)) {
            return {};
        }
        return value;
    }
    async ensureRecurringNotificationPreferences(params) {
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
                    message: 'PagSeguro recurring webhook requires notification preferences URL',
                },
                processMessage: 'PagSeguro recurring notificationUrl is required to receive subscription webhooks',
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
    resolveRecurringNotificationUrl(dtoIn) {
        const config = dtoIn.config ?? {};
        const transactionConfig = this.asObject(config.transactionConfig);
        const gatewayConfig = this.asObject(config.gatewayConfig);
        const apiCredentialConfig = this.asObject(config.apiCredentialConfig);
        return (this.toNullableString(transactionConfig.recurringNotificationUrl) ??
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
            this.toNullableString(apiCredentialConfig.notification_url));
    }
    toNullableString(value) {
        if (value === undefined || value === null) {
            return null;
        }
        const stringValue = String(value).trim();
        return stringValue === '' ? null : stringValue;
    }
    toRequiredString(value, message) {
        const stringValue = this.toNullableString(value);
        if (stringValue === null) {
            throw new Error(message);
        }
        return stringValue;
    }
    limitText(value, limit) {
        if (value.length <= limit) {
            return value;
        }
        return value.slice(0, limit);
    }
    nowAsIso() {
        return new Date().toISOString();
    }
};
exports.PagSeguroRecurringPaymentProvider = PagSeguroRecurringPaymentProvider;
exports.PagSeguroRecurringPaymentProvider = PagSeguroRecurringPaymentProvider = __decorate([
    (0, common_1.Injectable)()
], PagSeguroRecurringPaymentProvider);
//# sourceMappingURL=pagseguro-recurring-payment.provider.js.map