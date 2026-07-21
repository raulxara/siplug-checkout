"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetMercadoPagoPaymentDtoIn = void 0;
class GetMercadoPagoPaymentDtoIn {
    paymentId;
    accessToken;
    constructor(params) {
        this.paymentId = String(params.paymentId ?? '').trim();
        this.accessToken = String(params.accessToken ?? '').trim();
        if (this.paymentId === '') {
            throw new Error('paymentId is required');
        }
        if (this.accessToken === '') {
            throw new Error('accessToken is required');
        }
    }
}
exports.GetMercadoPagoPaymentDtoIn = GetMercadoPagoPaymentDtoIn;
//# sourceMappingURL=get-mercado-pago-payment.dto-in.js.map