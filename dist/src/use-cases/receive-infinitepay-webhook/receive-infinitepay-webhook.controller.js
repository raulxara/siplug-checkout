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
exports.ReceiveInfinitePayWebhookController = void 0;
const common_1 = require("@nestjs/common");
const receive_infinitepay_webhook_dto_in_1 = require("./dtos/receive-infinitepay-webhook.dto-in");
const receive_infinitepay_webhook_use_case_1 = require("./receive-infinitepay-webhook.use-case");
let ReceiveInfinitePayWebhookController = class ReceiveInfinitePayWebhookController {
    receiveInfinitePayWebhookUseCase;
    constructor(receiveInfinitePayWebhookUseCase) {
        this.receiveInfinitePayWebhookUseCase = receiveInfinitePayWebhookUseCase;
    }
    async handle(apiCredentialId, body, headers) {
        const dtoOut = await this.receiveInfinitePayWebhookUseCase.exec(new receive_infinitepay_webhook_dto_in_1.ReceiveInfinitePayWebhookDtoIn({
            apiCredentialId,
            payload: body,
            headers: this.normalizeHeaders(headers),
        }));
        return {
            status: 'success',
            message: 'infinitepay webhook received successfully',
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
            normalized[key] = Array.isArray(value) ? value.join(',') : value;
        }
        return normalized;
    }
};
exports.ReceiveInfinitePayWebhookController = ReceiveInfinitePayWebhookController;
__decorate([
    (0, common_1.Post)([
        'infinitepay',
        'infinitepay/:apiCredentialId',
        'infinitypay',
        'infinitypay/:apiCredentialId',
    ]),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Param)('apiCredentialId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Headers)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], ReceiveInfinitePayWebhookController.prototype, "handle", null);
exports.ReceiveInfinitePayWebhookController = ReceiveInfinitePayWebhookController = __decorate([
    (0, common_1.Controller)('webhooks/gateways'),
    __metadata("design:paramtypes", [receive_infinitepay_webhook_use_case_1.ReceiveInfinitePayWebhookUseCase])
], ReceiveInfinitePayWebhookController);
//# sourceMappingURL=receive-infinitepay-webhook.controller.js.map