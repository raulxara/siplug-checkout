"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResolvePaymentGatewayCredentialDtoIn = void 0;
class ResolvePaymentGatewayCredentialDtoIn {
    officeId;
    clientId;
    paymentType;
    paymentMethod;
    constructor(params) {
        this.officeId = params.officeId;
        this.clientId = params.clientId;
        this.paymentType = params.paymentType;
        this.paymentMethod = params.paymentMethod;
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