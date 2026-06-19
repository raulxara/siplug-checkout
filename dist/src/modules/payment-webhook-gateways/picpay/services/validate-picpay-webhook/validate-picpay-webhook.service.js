"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidatePicPayWebhookService = void 0;
const common_1 = require("@nestjs/common");
const crypto_1 = require("crypto");
const validate_picpay_webhook_dto_out_1 = require("./dtos/validate-picpay-webhook.dto-out");
let ValidatePicPayWebhookService = class ValidatePicPayWebhookService {
    exec(dtoIn) {
        if (dtoIn.webhookToken === null) {
            if (dtoIn.authMode === 'optional') {
                return new validate_picpay_webhook_dto_out_1.ValidatePicPayWebhookDtoOut(false, true, 'webhookToken was not configured and auth mode is optional');
            }
            throw new Error('PicPay webhookToken is required');
        }
        if (dtoIn.authorization === null) {
            if (dtoIn.authMode === 'optional') {
                return new validate_picpay_webhook_dto_out_1.ValidatePicPayWebhookDtoOut(false, true, 'authorization header was not received and auth mode is optional');
            }
            throw new Error('authorization header is required');
        }
        const receivedToken = this.normalizeAuthorizationToken(dtoIn.authorization);
        const expectedToken = this.normalizeAuthorizationToken(dtoIn.webhookToken);
        if (!this.safeCompare(receivedToken, expectedToken)) {
            throw new Error('invalid PicPay webhook authorization token');
        }
        return new validate_picpay_webhook_dto_out_1.ValidatePicPayWebhookDtoOut(true, false, null);
    }
    normalizeAuthorizationToken(value) {
        const trimmed = value.trim();
        if (trimmed.toLowerCase().startsWith('bearer ')) {
            return trimmed.substring(7).trim();
        }
        return trimmed;
    }
    safeCompare(valueA, valueB) {
        const bufferA = Buffer.from(valueA, 'utf8');
        const bufferB = Buffer.from(valueB, 'utf8');
        if (bufferA.length !== bufferB.length) {
            return false;
        }
        return (0, crypto_1.timingSafeEqual)(bufferA, bufferB);
    }
};
exports.ValidatePicPayWebhookService = ValidatePicPayWebhookService;
exports.ValidatePicPayWebhookService = ValidatePicPayWebhookService = __decorate([
    (0, common_1.Injectable)()
], ValidatePicPayWebhookService);
//# sourceMappingURL=validate-picpay-webhook.service.js.map