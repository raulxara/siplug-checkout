"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchMercadoPagoPaymentService = void 0;
const common_1 = require("@nestjs/common");
const fetch_mercado_pago_payment_dto_out_1 = require("./dtos/fetch-mercado-pago-payment.dto-out");
let FetchMercadoPagoPaymentService = class FetchMercadoPagoPaymentService {
    async exec(dtoIn) {
        try {
            const response = await fetch(`https://api.mercadopago.com/v1/payments/${encodeURIComponent(dtoIn.paymentId)}`, {
                method: 'GET',
                headers: {
                    accept: 'application/json',
                    Authorization: `Bearer ${dtoIn.accessToken}`,
                },
            });
            const responseBody = (await response.json().catch(() => ({
                message: 'Mercado Pago returned a non JSON response',
            })));
            if (!response.ok) {
                return new fetch_mercado_pago_payment_dto_out_1.FetchMercadoPagoPaymentDtoOut(this.toNullableString(responseBody.id), String(response.status), 'failed', 'gateway_status_fetch_failed', this.extractMercadoPagoErrorMessage(responseBody) ??
                    `Mercado Pago payment fetch failed with status ${response.status}`, responseBody, {
                    ok: false,
                    endpoint: '/v1/payments/{id}',
                    httpStatus: response.status,
                    paymentId: dtoIn.paymentId,
                }, null, null, null, null, null, null, this.nowAsSqlDateTime(), null, null);
            }
            const gatewayStatus = this.toNullableString(responseBody.status) ?? 'unknown';
            const gatewayStatusDetail = this.toNullableString(responseBody.status_detail);
            const status = this.mapMercadoPagoStatusToInternalStatus({
                status: gatewayStatus,
                statusDetail: gatewayStatusDetail,
            });
            const processStatus = this.mapMercadoPagoStatusToProcessStatus({
                status: gatewayStatus,
                statusDetail: gatewayStatusDetail,
            });
            const transactionData = responseBody.point_of_interaction?.transaction_data;
            return new fetch_mercado_pago_payment_dto_out_1.FetchMercadoPagoPaymentDtoOut(this.toNullableString(responseBody.id), gatewayStatus, status, processStatus, `Mercado Pago payment synchronized with status ${gatewayStatus}${gatewayStatusDetail !== null ? `/${gatewayStatusDetail}` : ''}`, responseBody, {
                ok: true,
                endpoint: '/v1/payments/{id}',
                httpStatus: response.status,
                paymentId: responseBody.id ?? dtoIn.paymentId,
                paymentStatus: responseBody.status ?? null,
                paymentStatusDetail: responseBody.status_detail ?? null,
            }, transactionData?.qr_code ?? null, transactionData?.qr_code_base64 ?? null, transactionData?.ticket_url ?? null, status === 'paid'
                ? this.formatExternalDate(responseBody.date_approved) ??
                    this.nowAsSqlDateTime()
                : null, status === 'authorized' ? this.nowAsSqlDateTime() : null, status === 'canceled' ? this.nowAsSqlDateTime() : null, status === 'failed' ? this.nowAsSqlDateTime() : null, status === 'refunded' ? this.nowAsSqlDateTime() : null, this.formatExternalDate(responseBody.date_of_expiration));
        }
        catch (error) {
            const message = error instanceof Error
                ? error.message
                : 'error on fetch Mercado Pago payment';
            throw new Error(message);
        }
    }
    mapMercadoPagoStatusToInternalStatus(params) {
        const status = params.status.toLowerCase().trim();
        const statusDetail = params.statusDetail?.toLowerCase().trim() ?? null;
        if (status === 'approved') {
            return 'paid';
        }
        if (status === 'authorized') {
            return 'authorized';
        }
        if (status === 'pending' ||
            status === 'in_process' ||
            statusDetail === 'pending_waiting_transfer') {
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
    mapMercadoPagoStatusToProcessStatus(params) {
        const status = params.status.toLowerCase().trim();
        const statusDetail = params.statusDetail?.toLowerCase().trim() ?? null;
        if (status === 'approved') {
            return 'gateway_approved';
        }
        if (status === 'authorized') {
            return 'gateway_authorized';
        }
        if (status === 'pending' ||
            status === 'in_process' ||
            statusDetail === 'pending_waiting_transfer') {
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
        return 'gateway_synced';
    }
    extractMercadoPagoErrorMessage(responseBody) {
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
            return (this.toNullableString(firstCause.description) ??
                this.toNullableString(firstCause.message) ??
                this.toNullableString(firstCause.code));
        }
        return null;
    }
    toNullableString(value) {
        if (value === undefined || value === null) {
            return null;
        }
        const stringValue = String(value).trim();
        return stringValue === '' ? null : stringValue;
    }
    formatExternalDate(value) {
        if (!value) {
            return null;
        }
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) {
            return null;
        }
        return this.formatDateToSqlDateTime(date);
    }
    nowAsSqlDateTime() {
        return this.formatDateToSqlDateTime(new Date());
    }
    formatDateToSqlDateTime(date) {
        const year = date.getFullYear();
        const month = this.pad(date.getMonth() + 1);
        const day = this.pad(date.getDate());
        const hours = this.pad(date.getHours());
        const minutes = this.pad(date.getMinutes());
        const seconds = this.pad(date.getSeconds());
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }
    pad(value) {
        return String(value).padStart(2, '0');
    }
};
exports.FetchMercadoPagoPaymentService = FetchMercadoPagoPaymentService;
exports.FetchMercadoPagoPaymentService = FetchMercadoPagoPaymentService = __decorate([
    (0, common_1.Injectable)()
], FetchMercadoPagoPaymentService);
//# sourceMappingURL=fetch-mercado-pago-payment.service.js.map