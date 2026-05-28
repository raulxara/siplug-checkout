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
exports.ReceiveGatewayWebhookController = void 0;
const common_1 = require("@nestjs/common");
const receive_gateway_webhook_dto_in_1 = require("./dtos/receive-gateway-webhook.dto-in");
const receive_gateway_webhook_use_case_1 = require("./receive-gateway-webhook.use-case");
let ReceiveGatewayWebhookController = class ReceiveGatewayWebhookController {
    receiveGatewayWebhookUseCase;
    constructor(receiveGatewayWebhookUseCase) {
        this.receiveGatewayWebhookUseCase = receiveGatewayWebhookUseCase;
    }
    async handle(provider, body, query, headers) {
        try {
            const dtoOut = await this.receiveGatewayWebhookUseCase.exec(new receive_gateway_webhook_dto_in_1.ReceiveGatewayWebhookDtoIn({
                provider,
                body: this.asRecord(body),
                query: this.asRecord(query),
                headers: this.asRecord(headers),
            }));
            return {
                status: 'success',
                message: 'gateway webhook received successfully',
                data: dtoOut,
            };
        }
        catch (error) {
            const message = error instanceof Error
                ? error.message
                : 'error on receive gateway webhook controller';
            throw new common_1.BadRequestException({
                status: 'error',
                message,
            });
        }
    }
    asRecord(value) {
        if (!value || typeof value !== 'object' || Array.isArray(value)) {
            return {};
        }
        return value;
    }
};
exports.ReceiveGatewayWebhookController = ReceiveGatewayWebhookController;
__decorate([
    (0, common_1.Post)(':provider'),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Param)('provider')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Query)()),
    __param(3, (0, common_1.Headers)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], ReceiveGatewayWebhookController.prototype, "handle", null);
exports.ReceiveGatewayWebhookController = ReceiveGatewayWebhookController = __decorate([
    (0, common_1.Controller)('webhooks/gateways'),
    __metadata("design:paramtypes", [receive_gateway_webhook_use_case_1.ReceiveGatewayWebhookUseCase])
], ReceiveGatewayWebhookController);
//# sourceMappingURL=receive-gateway-webhook.controller.js.map