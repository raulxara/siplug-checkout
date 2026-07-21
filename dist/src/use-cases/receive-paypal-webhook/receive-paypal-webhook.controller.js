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
exports.ReceivePayPalWebhookController = void 0;
const common_1 = require("@nestjs/common");
const receive_paypal_webhook_dto_in_1 = require("./dtos/receive-paypal-webhook.dto-in");
const receive_paypal_webhook_use_case_1 = require("./receive-paypal-webhook.use-case");
let ReceivePayPalWebhookController = class ReceivePayPalWebhookController {
    receivePayPalWebhookUseCase;
    constructor(receivePayPalWebhookUseCase) {
        this.receivePayPalWebhookUseCase = receivePayPalWebhookUseCase;
    }
    async handle(apiCredentialId, body, headers) {
        const dtoOut = await this.receivePayPalWebhookUseCase.exec(new receive_paypal_webhook_dto_in_1.ReceivePayPalWebhookDtoIn({
            apiCredentialId,
            payload: body,
            headers: this.normalizeHeaders(headers),
        }));
        return {
            status: 'success',
            message: 'paypal webhook received successfully',
            data: {
                paymentWebhookEvent: dtoOut.paymentWebhookEvent,
                paymentTransaction: dtoOut.paymentTransaction,
                processingResult: dtoOut.processingResult,
                wasAlreadyRegistered: dtoOut.wasAlreadyRegistered,
            },
        };
    }
    normalizeHeaders(headers) {
        const normalized = {};
        for (const [key, value] of Object.entries(headers)) {
            normalized[key.toLowerCase()] = Array.isArray(value)
                ? value.join(',')
                : value;
        }
        return normalized;
    }
};
exports.ReceivePayPalWebhookController = ReceivePayPalWebhookController;
__decorate([
    (0, common_1.Post)('paypal/:apiCredentialId'),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Param)('apiCredentialId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Headers)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], ReceivePayPalWebhookController.prototype, "handle", null);
exports.ReceivePayPalWebhookController = ReceivePayPalWebhookController = __decorate([
    (0, common_1.Controller)('webhooks/gateways'),
    __metadata("design:paramtypes", [receive_paypal_webhook_use_case_1.ReceivePayPalWebhookUseCase])
], ReceivePayPalWebhookController);
//# sourceMappingURL=receive-paypal-webhook.controller.js.map