"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReceiveMercadoPagoWebhookController = void 0;
const common_1 = require("@nestjs/common");
const receive_mercado_pago_webhook_dto_in_1 = require("./dtos/receive-mercado-pago-webhook.dto-in");
const receive_mercado_pago_webhook_use_case_1 = require("./receive-mercado-pago-webhook.use-case");
let ReceiveMercadoPagoWebhookController = class ReceiveMercadoPagoWebhookController {
    receiveMercadoPagoWebhookUseCase;
    constructor(receiveMercadoPagoWebhookUseCase) {
        this.receiveMercadoPagoWebhookUseCase = receiveMercadoPagoWebhookUseCase;
    }
    async handle(apiCredentialId, body, queryParams, headers) {
        const dtoOut = await this.receiveMercadoPagoWebhookUseCase.exec(new receive_mercado_pago_webhook_dto_in_1.ReceiveMercadoPagoWebhookDtoIn({
            apiCredentialId: this.resolveApiCredentialId({
                apiCredentialId,
                queryParams,
            }),
            payload: body,
            queryParams,
            headers: this.normalizeHeaders(headers),
            xSignature: this.resolveHeader(headers, 'x-signature'),
            xRequestId: this.resolveHeader(headers, 'x-request-id'),
        }));
        return {
            status: 'success',
            message: 'mercado pago webhook received successfully',
            data: {
                paymentWebhookEvent: dtoOut.paymentWebhookEvent,
                paymentTransaction: dtoOut.paymentTransaction,
                processingResult: dtoOut.processingResult,
                wasAlreadyRegistered: dtoOut.wasAlreadyRegistered,
            },
        };
    }
    resolveApiCredentialId(params) {
        const fromPath = String(params.apiCredentialId ?? '').trim();
        if (fromPath !== '') {
            return fromPath;
        }
        return (this.extractString(params.queryParams, 'apiCredentialId') ??
            this.extractString(params.queryParams, 'api_credential_id') ??
            this.extractString(params.queryParams, 'credentialId') ??
            this.extractString(params.queryParams, 'credential_id') ??
            '');
    }
    resolveHeader(headers, key) {
        const value = headers[key];
        if (Array.isArray(value)) {
            return String(value[0] ?? '').trim();
        }
        return String(value ?? '').trim();
    }
    normalizeHeaders(headers) {
        const normalized = {};
        for (const [key, value] of Object.entries(headers)) {
            normalized[key] = Array.isArray(value) ? value[0] : value;
        }
        return normalized;
    }
    extractString(object, key) {
        const value = object[key];
        if (value === undefined || value === null) {
            return null;
        }
        const stringValue = String(value).trim();
        return stringValue === '' ? null : stringValue;
    }
};
exports.ReceiveMercadoPagoWebhookController = ReceiveMercadoPagoWebhookController;
__decorate([
    (0, common_1.Post)(['mercado-pago', 'mercado-pago/:apiCredentialId']),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Param)('apiCredentialId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Query)()),
    __param(3, (0, common_1.Headers)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], ReceiveMercadoPagoWebhookController.prototype, "handle", null);
exports.ReceiveMercadoPagoWebhookController = ReceiveMercadoPagoWebhookController = __decorate([
    (0, common_1.Controller)('webhooks/gateways'),
    __metadata("design:paramtypes", [receive_mercado_pago_webhook_use_case_1.ReceiveMercadoPagoWebhookUseCase])
], ReceiveMercadoPagoWebhookController);
//# sourceMappingURL=receive-mercado-pago-webhook.controller.js.map