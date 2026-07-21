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
exports.ReceivePagSeguroShortWebhookController = void 0;
const common_1 = require("@nestjs/common");
const receive_pagseguro_webhook_dto_in_1 = require("./dtos/receive-pagseguro-webhook.dto-in");
const receive_pagseguro_webhook_use_case_1 = require("./receive-pagseguro-webhook.use-case");
let ReceivePagSeguroShortWebhookController = class ReceivePagSeguroShortWebhookController {
    receivePagSeguroWebhookUseCase;
    constructor(receivePagSeguroWebhookUseCase) {
        this.receivePagSeguroWebhookUseCase = receivePagSeguroWebhookUseCase;
    }
    async handle(apiCredentialId, body, headers, request) {
        const dtoOut = await this.receivePagSeguroWebhookUseCase.exec(new receive_pagseguro_webhook_dto_in_1.ReceivePagSeguroWebhookDtoIn({
            apiCredentialId,
            payload: body,
            rawBody: this.resolveRawBody(request, body),
            headers: this.normalizeHeaders(headers),
            xAuthenticityToken: this.resolveHeader(headers, 'x-authenticity-token'),
        }));
        return {
            received: true,
            provider: 'pagseguro',
            eventId: this.extractString(dtoOut.processingResult, 'eventId'),
            processed: true,
            wasAlreadyRegistered: dtoOut.wasAlreadyRegistered,
        };
    }
    resolveRawBody(request, body) {
        if (request.rawBody instanceof Buffer) {
            return request.rawBody.toString('utf8');
        }
        return JSON.stringify(body);
    }
    resolveHeader(headers, key) {
        const value = headers[key];
        if (Array.isArray(value)) {
            return String(value[0] ?? '').trim() || null;
        }
        return String(value ?? '').trim() || null;
    }
    normalizeHeaders(headers) {
        const normalized = {};
        for (const [key, value] of Object.entries(headers)) {
            normalized[key] = Array.isArray(value) ? value[0] : value;
        }
        return normalized;
    }
    extractString(data, key) {
        const value = data[key];
        if (typeof value !== 'string') {
            return null;
        }
        const normalized = value.trim();
        return normalized !== '' ? normalized : null;
    }
};
exports.ReceivePagSeguroShortWebhookController = ReceivePagSeguroShortWebhookController;
__decorate([
    (0, common_1.Post)('w/p/:apiCredentialId'),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Param)('apiCredentialId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Headers)()),
    __param(3, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], ReceivePagSeguroShortWebhookController.prototype, "handle", null);
exports.ReceivePagSeguroShortWebhookController = ReceivePagSeguroShortWebhookController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [receive_pagseguro_webhook_use_case_1.ReceivePagSeguroWebhookUseCase])
], ReceivePagSeguroShortWebhookController);
//# sourceMappingURL=receive-pagseguro-short-webhook.controller.js.map