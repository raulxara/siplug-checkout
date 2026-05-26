"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DispatchGatewayPaymentService = void 0;
const common_1 = require("@nestjs/common");
const gateway_payment_dto_out_1 = require("../../dtos/gateway-payment.dto-out");
const resolve_gateway_payment_provider_service_1 = require("../resolve-gateway-payment-provider/resolve-gateway-payment-provider.service");
let DispatchGatewayPaymentService = class DispatchGatewayPaymentService {
    resolveGatewayPaymentProviderService;
    constructor(resolveGatewayPaymentProviderService) {
        this.resolveGatewayPaymentProviderService = resolveGatewayPaymentProviderService;
    }
    async exec(dtoIn) {
        try {
            const provider = this.resolveGatewayPaymentProviderService.exec(dtoIn.gatewayProvider);
            return await provider.processPayment(dtoIn);
        }
        catch (error) {
            const message = error instanceof Error
                ? error.message
                : 'error on dispatch gateway payment';
            return new gateway_payment_dto_out_1.GatewayPaymentDtoOut({
                success: false,
                provider: dtoIn.gatewayProvider,
                gatewayTransactionId: null,
                gatewayStatus: null,
                status: dtoIn.paymentTransaction.status,
                processStatus: 'gateway_dispatch_failed',
                processMessage: message,
                providerRequest: {
                    paymentTransactionId: dtoIn.paymentTransaction._id,
                    idempotencyKey: dtoIn.idempotencyKey,
                    providerPayload: dtoIn.providerPayload,
                },
                providerResponse: {
                    message,
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
    }
};
exports.DispatchGatewayPaymentService = DispatchGatewayPaymentService;
exports.DispatchGatewayPaymentService = DispatchGatewayPaymentService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [resolve_gateway_payment_provider_service_1.ResolveGatewayPaymentProviderService])
], DispatchGatewayPaymentService);
//# sourceMappingURL=dispatch-gateway-payment.service.js.map