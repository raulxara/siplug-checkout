"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidatePagSeguroWebhookService = void 0;
const common_1 = require("@nestjs/common");
const crypto_1 = require("crypto");
const validate_pagseguro_webhook_dto_out_1 = require("./dtos/validate-pagseguro-webhook.dto-out");
let ValidatePagSeguroWebhookService = class ValidatePagSeguroWebhookService {
    exec(dtoIn) {
        if (dtoIn.xAuthenticityToken === null) {
            if (dtoIn.signatureMode === 'optional') {
                return new validate_pagseguro_webhook_dto_out_1.ValidatePagSeguroWebhookDtoOut(false, true, 'x-authenticity-token was not received and signature mode is optional');
            }
            throw new Error('x-authenticity-token header is required');
        }
        const expectedSignature = (0, crypto_1.createHash)('sha256')
            .update(`${dtoIn.token}-${dtoIn.rawBody}`)
            .digest('hex');
        if (!this.safeCompare(dtoIn.xAuthenticityToken, expectedSignature)) {
            throw new Error('invalid PagSeguro webhook signature');
        }
        return new validate_pagseguro_webhook_dto_out_1.ValidatePagSeguroWebhookDtoOut(true, false, null);
    }
    safeCompare(valueA, valueB) {
        const bufferA = Buffer.from(valueA, 'hex');
        const bufferB = Buffer.from(valueB, 'hex');
        if (bufferA.length !== bufferB.length) {
            return false;
        }
        return (0, crypto_1.timingSafeEqual)(bufferA, bufferB);
    }
};
exports.ValidatePagSeguroWebhookService = ValidatePagSeguroWebhookService;
exports.ValidatePagSeguroWebhookService = ValidatePagSeguroWebhookService = __decorate([
    (0, common_1.Injectable)()
], ValidatePagSeguroWebhookService);
//# sourceMappingURL=validate-pagseguro-webhook.service.js.map