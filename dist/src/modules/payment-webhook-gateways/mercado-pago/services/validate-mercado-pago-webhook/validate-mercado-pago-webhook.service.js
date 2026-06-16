"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidateMercadoPagoWebhookService = void 0;
const common_1 = require("@nestjs/common");
const crypto_1 = require("crypto");
const validate_mercado_pago_webhook_dto_out_1 = require("./dtos/validate-mercado-pago-webhook.dto-out");
let ValidateMercadoPagoWebhookService = class ValidateMercadoPagoWebhookService {
    exec(dtoIn) {
        const parsedSignature = this.parseSignature(dtoIn.xSignature);
        const manifest = this.buildManifest({
            dataId: dtoIn.dataId,
            xRequestId: dtoIn.xRequestId,
            timestamp: parsedSignature.timestamp,
        });
        const expectedSignature = (0, crypto_1.createHmac)('sha256', dtoIn.webhookSecret)
            .update(manifest)
            .digest('hex');
        if (!this.safeCompare(parsedSignature.signature, expectedSignature)) {
            throw new Error('invalid Mercado Pago webhook signature');
        }
        return new validate_mercado_pago_webhook_dto_out_1.ValidateMercadoPagoWebhookDtoOut(true, parsedSignature.timestamp);
    }
    buildManifest(params) {
        const parts = [];
        if (params.dataId !== null) {
            parts.push(`id:${params.dataId}`);
        }
        if (params.xRequestId.trim() !== '') {
            parts.push(`request-id:${params.xRequestId}`);
        }
        if (params.timestamp.trim() !== '') {
            parts.push(`ts:${params.timestamp}`);
        }
        return `${parts.join(';')};`;
    }
    parseSignature(signature) {
        const parts = signature.split(',').map((part) => part.trim());
        const timestampPart = parts.find((part) => part.startsWith('ts='));
        const signaturePart = parts.find((part) => part.startsWith('v1='));
        if (!timestampPart) {
            throw new Error('Mercado Pago signature timestamp not found');
        }
        if (!signaturePart) {
            throw new Error('Mercado Pago v1 signature not found');
        }
        return {
            timestamp: timestampPart.replace('ts=', '').trim(),
            signature: signaturePart.replace('v1=', '').trim(),
        };
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
exports.ValidateMercadoPagoWebhookService = ValidateMercadoPagoWebhookService;
exports.ValidateMercadoPagoWebhookService = ValidateMercadoPagoWebhookService = __decorate([
    (0, common_1.Injectable)()
], ValidateMercadoPagoWebhookService);
//# sourceMappingURL=validate-mercado-pago-webhook.service.js.map