"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResolvePaymentGatewayCredentialDtoIn = void 0;
class ResolvePaymentGatewayCredentialDtoIn {
    officeId;
    clientId;
    paymentType;
    paymentMethod;
    gatewayProvider;
    gatewaySlug;
    gatewayId;
    apiCredentialId;
    constructor(params) {
        this.officeId = params.officeId;
        this.clientId = params.clientId;
        this.paymentType = params.paymentType;
        this.paymentMethod = params.paymentMethod;
        this.gatewayProvider =
            params.gatewayProvider !== undefined && params.gatewayProvider !== null
                ? String(params.gatewayProvider).trim()
                : null;
        this.gatewaySlug =
            params.gatewaySlug !== undefined && params.gatewaySlug !== null
                ? String(params.gatewaySlug).trim()
                : null;
        this.gatewayId =
            params.gatewayId !== undefined && params.gatewayId !== null
                ? String(params.gatewayId).trim()
                : null;
        this.apiCredentialId =
            params.apiCredentialId !== undefined && params.apiCredentialId !== null
                ? String(params.apiCredentialId).trim()
                : null;
        if (this.officeId.trim() === '') {
            throw new Error('officeId is required');
        }
        if (this.clientId.trim() === '') {
            throw new Error('clientId is required');
        }
        if (this.paymentType.trim() === '') {
            throw new Error('paymentType is required');
        }
        if (this.paymentMethod.trim() === '') {
            throw new Error('paymentMethod is required');
        }
    }
}
exports.ResolvePaymentGatewayCredentialDtoIn = ResolvePaymentGatewayCredentialDtoIn;
//# sourceMappingURL=resolve-payment-gateway-credential.dto-in.js.map