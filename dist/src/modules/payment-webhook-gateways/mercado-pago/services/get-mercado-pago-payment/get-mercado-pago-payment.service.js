"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetMercadoPagoPaymentService = void 0;
const common_1 = require("@nestjs/common");
const get_mercado_pago_payment_dto_out_1 = require("./dtos/get-mercado-pago-payment.dto-out");
let GetMercadoPagoPaymentService = class GetMercadoPagoPaymentService {
    async exec(dtoIn) {
        const response = await fetch(`https://api.mercadopago.com/v1/payments/${encodeURIComponent(dtoIn.paymentId)}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${dtoIn.accessToken}`,
                'Content-Type': 'application/json',
            },
        });
        const responseText = await response.text();
        const responseBody = this.parseJson(responseText);
        if (!response.ok) {
            throw new Error(`Mercado Pago get payment failed with status ${response.status}`);
        }
        if (responseBody === null) {
            throw new Error('Mercado Pago payment response is invalid');
        }
        return new get_mercado_pago_payment_dto_out_1.GetMercadoPagoPaymentDtoOut(responseBody, {
            statusCode: response.status,
            ok: response.ok,
            body: responseBody,
        });
    }
    parseJson(value) {
        try {
            const parsed = JSON.parse(value);
            if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
                return null;
            }
            return parsed;
        }
        catch {
            return null;
        }
    }
};
exports.GetMercadoPagoPaymentService = GetMercadoPagoPaymentService;
exports.GetMercadoPagoPaymentService = GetMercadoPagoPaymentService = __decorate([
    (0, common_1.Injectable)()
], GetMercadoPagoPaymentService);
//# sourceMappingURL=get-mercado-pago-payment.service.js.map