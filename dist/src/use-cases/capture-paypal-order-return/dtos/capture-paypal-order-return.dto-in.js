"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CapturePayPalOrderReturnDtoIn = void 0;
class CapturePayPalOrderReturnDtoIn {
    apiCredentialId;
    orderId;
    constructor(params) {
        this.apiCredentialId = String(params.apiCredentialId ?? '').trim();
        this.orderId = String(params.orderId ?? '').trim();
        if (this.apiCredentialId === '') {
            throw new Error('apiCredentialId is required');
        }
        if (this.orderId === '') {
            throw new Error('PayPal orderId is required');
        }
    }
}
exports.CapturePayPalOrderReturnDtoIn = CapturePayPalOrderReturnDtoIn;
//# sourceMappingURL=capture-paypal-order-return.dto-in.js.map