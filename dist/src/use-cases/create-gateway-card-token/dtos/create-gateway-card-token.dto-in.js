"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateGatewayCardTokenDtoIn = void 0;
class CreateGatewayCardTokenDtoIn {
    apiCredentialId;
    cardNumber;
    securityCode;
    expirationMonth;
    expirationYear;
    cardholderName;
    documentType;
    documentValue;
    constructor(params) {
        this.apiCredentialId = String(params.apiCredentialId ?? '').trim();
        this.cardNumber = String(params.cardNumber ?? '').replace(/\D/g, '');
        this.securityCode = String(params.securityCode ?? '').replace(/\D/g, '');
        this.expirationMonth = String(params.expirationMonth ?? '').replace(/\D/g, '');
        this.expirationYear = String(params.expirationYear ?? '').replace(/\D/g, '');
        this.cardholderName = String(params.cardholderName ?? '').trim();
        this.documentType = String(params.documentType ?? '').trim().toUpperCase();
        this.documentValue = String(params.documentValue ?? '').replace(/\D/g, '');
        if (this.apiCredentialId === '') {
            throw new Error('apiCredentialId is required');
        }
        if (this.cardNumber === '') {
            throw new Error('cardNumber is required');
        }
        if (this.securityCode === '') {
            throw new Error('securityCode is required');
        }
        if (this.expirationMonth === '') {
            throw new Error('expirationMonth is required');
        }
        if (this.expirationYear === '') {
            throw new Error('expirationYear is required');
        }
        if (this.cardholderName === '') {
            throw new Error('cardholderName is required');
        }
        if (this.documentType === '') {
            throw new Error('documentType is required');
        }
        if (this.documentValue === '') {
            throw new Error('documentValue is required');
        }
    }
}
exports.CreateGatewayCardTokenDtoIn = CreateGatewayCardTokenDtoIn;
//# sourceMappingURL=create-gateway-card-token.dto-in.js.map