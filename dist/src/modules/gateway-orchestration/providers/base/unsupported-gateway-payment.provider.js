"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnsupportedGatewayPaymentProvider = void 0;
const gateway_payment_dto_out_1 = require("../../dtos/gateway-payment.dto-out");
class UnsupportedGatewayPaymentProvider {
    providerName;
    aliases;
    constructor(providerName, aliases) {
        this.providerName = providerName;
        this.aliases = aliases;
    }
    getProviderName() {
        return this.providerName;
    }
    supports(gatewayProvider) {
        const normalizedProvider = this.normalize(gatewayProvider);
        return this.aliases
            .map((alias) => this.normalize(alias))
            .includes(normalizedProvider);
    }
    async processPayment(dtoIn) {
        return new gateway_payment_dto_out_1.GatewayPaymentDtoOut({
            success: false,
            provider: this.providerName,
            gatewayTransactionId: null,
            gatewayStatus: null,
            status: dtoIn.paymentTransaction.status,
            processStatus: 'gateway_provider_not_implemented',
            processMessage: `${this.providerName} payment provider is not implemented yet`,
            providerRequest: {
                paymentTransactionId: dtoIn.paymentTransaction._id,
                idempotencyKey: dtoIn.idempotencyKey,
                providerPayload: dtoIn.providerPayload,
            },
            providerResponse: {
                message: 'gateway provider adapter not implemented yet',
                provider: this.providerName,
            },
            gatewayResponse: null,
            qrCode: null,
            qrCodeBase64: null,
            boletoUrl: null,
            checkoutUrl: null,
            paidAt: null,
            authorizedAt: null,
            canceledAt: null,
            failedAt: null,
            refundedAt: null,
            expiresAt: dtoIn.paymentTransaction.expiresAt,
        });
    }
    normalize(value) {
        return value
            .toLowerCase()
            .trim()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/\./g, '')
            .replace(/-/g, '_')
            .replace(/\s+/g, '_');
    }
}
exports.UnsupportedGatewayPaymentProvider = UnsupportedGatewayPaymentProvider;
//# sourceMappingURL=unsupported-gateway-payment.provider.js.map