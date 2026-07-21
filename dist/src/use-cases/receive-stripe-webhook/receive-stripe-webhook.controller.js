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
exports.ReceiveStripeWebhookController = void 0;
const common_1 = require("@nestjs/common");
const receive_stripe_webhook_dto_in_1 = require("./dtos/receive-stripe-webhook.dto-in");
const receive_stripe_webhook_use_case_1 = require("./receive-stripe-webhook.use-case");
let ReceiveStripeWebhookController = class ReceiveStripeWebhookController {
    receiveStripeWebhookUseCase;
    constructor(receiveStripeWebhookUseCase) {
        this.receiveStripeWebhookUseCase = receiveStripeWebhookUseCase;
    }
    async handle(apiCredentialId, request, body, headers) {
        const rawBody = this.resolveRawBody(request);
        const stripeSignature = this.resolveHeader(headers, 'stripe-signature');
        const dtoOut = await this.receiveStripeWebhookUseCase.exec(new receive_stripe_webhook_dto_in_1.ReceiveStripeWebhookDtoIn({
            apiCredentialId,
            rawBody,
            payload: body,
            headers: this.normalizeHeaders(headers),
            stripeSignature,
        }));
        return {
            status: 'success',
            message: 'stripe webhook received successfully',
            data: {
                paymentWebhookEvent: dtoOut.paymentWebhookEvent,
                paymentTransaction: dtoOut.paymentTransaction,
                processingResult: dtoOut.processingResult,
                wasAlreadyRegistered: dtoOut.wasAlreadyRegistered,
            },
        };
    }
    resolveRawBody(request) {
        const rawBody = request.rawBody;
        if (!rawBody) {
            throw new Error('rawBody not found. Check NestFactory.create(AppModule, { rawBody: true })');
        }
        return rawBody.toString('utf8');
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
            normalized[key] = Array.isArray(value) ? value.join(',') : value;
        }
        return normalized;
    }
};
exports.ReceiveStripeWebhookController = ReceiveStripeWebhookController;
__decorate([
    (0, common_1.Post)('stripe/:apiCredentialId'),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Param)('apiCredentialId')),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Headers)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], ReceiveStripeWebhookController.prototype, "handle", null);
exports.ReceiveStripeWebhookController = ReceiveStripeWebhookController = __decorate([
    (0, common_1.Controller)('webhooks'),
    __metadata("design:paramtypes", [receive_stripe_webhook_use_case_1.ReceiveStripeWebhookUseCase])
], ReceiveStripeWebhookController);
//# sourceMappingURL=receive-stripe-webhook.controller.js.map