"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchMercadoPagoPaymentDtoIn = void 0;
class FetchMercadoPagoPaymentDtoIn {
    accessToken;
    paymentId;
    constructor(params) {
        this.accessToken = params.accessToken;
        this.paymentId = params.paymentId;
        if (this.accessToken.trim() === '') {
            throw new Error('accessToken is required');
        }
        if (this.paymentId.trim() === '') {
            throw new Error('paymentId is required');
        }
    }
}
exports.FetchMercadoPagoPaymentDtoIn = FetchMercadoPagoPaymentDtoIn;
//# sourceMappingURL=fetch-mercado-pago-payment.dto-in.js.map