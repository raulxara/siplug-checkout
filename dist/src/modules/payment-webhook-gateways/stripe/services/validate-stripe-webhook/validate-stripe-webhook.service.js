"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidateStripeWebhookService = void 0;
const common_1 = require("@nestjs/common");
const crypto_1 = require("crypto");
const validate_stripe_webhook_dto_out_1 = require("./dtos/validate-stripe-webhook.dto-out");
let ValidateStripeWebhookService = class ValidateStripeWebhookService {
    exec(dtoIn) {
        const parsedSignature = this.parseStripeSignature(dtoIn.stripeSignature);
        this.validateTimestamp({
            timestamp: parsedSignature.timestamp,
            toleranceInSeconds: dtoIn.toleranceInSeconds,
        });
        const signedPayload = `${parsedSignature.timestamp}.${dtoIn.rawBody}`;
        const expectedSignature = (0, crypto_1.createHmac)('sha256', dtoIn.endpointSecret)
            .update(signedPayload, 'utf8')
            .digest('hex');
        const isValid = parsedSignature.signatures.some((signature) => this.safeCompare(signature, expectedSignature));
        if (!isValid) {
            throw new Error('invalid Stripe webhook signature');
        }
        return new validate_stripe_webhook_dto_out_1.ValidateStripeWebhookDtoOut(true, parsedSignature.timestamp);
    }
    parseStripeSignature(signatureHeader) {
        const parts = signatureHeader.split(',').map((part) => part.trim());
        const timestampPart = parts.find((part) => part.startsWith('t='));
        const signatureParts = parts.filter((part) => part.startsWith('v1='));
        if (!timestampPart) {
            throw new Error('Stripe signature timestamp not found');
        }
        if (signatureParts.length === 0) {
            throw new Error('Stripe v1 signature not found');
        }
        const timestamp = Number(timestampPart.replace('t=', ''));
        if (Number.isNaN(timestamp)) {
            throw new Error('Stripe signature timestamp is invalid');
        }
        return {
            timestamp,
            signatures: signatureParts.map((part) => part.replace('v1=', '')),
        };
    }
    validateTimestamp(params) {
        const currentTimestamp = Math.floor(Date.now() / 1000);
        const difference = Math.abs(currentTimestamp - params.timestamp);
        if (difference > params.toleranceInSeconds) {
            throw new Error('Stripe webhook timestamp is outside tolerance');
        }
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
exports.ValidateStripeWebhookService = ValidateStripeWebhookService;
exports.ValidateStripeWebhookService = ValidateStripeWebhookService = __decorate([
    (0, common_1.Injectable)()
], ValidateStripeWebhookService);
//# sourceMappingURL=validate-stripe-webhook.service.js.map