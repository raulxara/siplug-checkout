"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateGatewayCardTokenDtoOut = void 0;
class CreateGatewayCardTokenDtoOut {
    provider;
    cardToken;
    publicKeyPrefix;
    firstSixDigits;
    lastFourDigits;
    expirationMonth;
    expirationYear;
    providerResponse;
    gatewayResponse;
    constructor(provider, cardToken, publicKeyPrefix, firstSixDigits, lastFourDigits, expirationMonth, expirationYear, providerResponse, gatewayResponse) {
        this.provider = provider;
        this.cardToken = cardToken;
        this.publicKeyPrefix = publicKeyPrefix;
        this.firstSixDigits = firstSixDigits;
        this.lastFourDigits = lastFourDigits;
        this.expirationMonth = expirationMonth;
        this.expirationYear = expirationYear;
        this.providerResponse = providerResponse;
        this.gatewayResponse = gatewayResponse;
    }
}
exports.CreateGatewayCardTokenDtoOut = CreateGatewayCardTokenDtoOut;
//# sourceMappingURL=create-gateway-card-token.dto-out.js.map