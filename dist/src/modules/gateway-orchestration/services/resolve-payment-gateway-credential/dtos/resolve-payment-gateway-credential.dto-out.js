"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResolvePaymentGatewayCredentialDtoOut = void 0;
class ResolvePaymentGatewayCredentialDtoOut {
    gateway;
    apiCredential;
    decryptedProviderToken;
    connectionData;
    constructor(gateway, apiCredential, decryptedProviderToken, connectionData) {
        this.gateway = gateway;
        this.apiCredential = apiCredential;
        this.decryptedProviderToken = decryptedProviderToken;
        this.connectionData = connectionData;
    }
}
exports.ResolvePaymentGatewayCredentialDtoOut = ResolvePaymentGatewayCredentialDtoOut;
//# sourceMappingURL=resolve-payment-gateway-credential.dto-out.js.map