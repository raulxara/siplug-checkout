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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CapturePayPalOrderReturnController = void 0;
const common_1 = require("@nestjs/common");
const capture_paypal_order_return_dto_in_1 = require("./dtos/capture-paypal-order-return.dto-in");
const capture_paypal_order_return_use_case_1 = require("./capture-paypal-order-return.use-case");
let CapturePayPalOrderReturnController = class CapturePayPalOrderReturnController {
    capturePayPalOrderReturnUseCase;
    constructor(capturePayPalOrderReturnUseCase) {
        this.capturePayPalOrderReturnUseCase = capturePayPalOrderReturnUseCase;
    }
    async captureReturn(apiCredentialId, token) {
        const dtoOut = await this.capturePayPalOrderReturnUseCase.exec(new capture_paypal_order_return_dto_in_1.CapturePayPalOrderReturnDtoIn({
            apiCredentialId,
            orderId: token,
        }));
        return {
            status: 'success',
            message: 'paypal order captured successfully',
            data: {
                paymentWebhookEvent: dtoOut.paymentWebhookEvent,
                paymentTransaction: dtoOut.paymentTransaction,
                processingResult: dtoOut.processingResult,
                providerResponse: dtoOut.providerResponse,
                wasAlreadyRegistered: dtoOut.wasAlreadyRegistered,
            },
        };
    }
    async cancelReturn(apiCredentialId, token) {
        const dtoOut = await this.capturePayPalOrderReturnUseCase.execCancel(new capture_paypal_order_return_dto_in_1.CapturePayPalOrderReturnDtoIn({
            apiCredentialId,
            orderId: token,
        }));
        return {
            status: 'success',
            message: 'paypal payment approval canceled by payer',
            data: {
                paymentWebhookEvent: dtoOut.paymentWebhookEvent,
                paymentTransaction: dtoOut.paymentTransaction,
                processingResult: dtoOut.processingResult,
                wasAlreadyRegistered: dtoOut.wasAlreadyRegistered,
            },
        };
    }
};
exports.CapturePayPalOrderReturnController = CapturePayPalOrderReturnController;
__decorate([
    (0, common_1.Get)('return/:apiCredentialId'),
    __param(0, (0, common_1.Param)('apiCredentialId')),
    __param(1, (0, common_1.Query)('token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], CapturePayPalOrderReturnController.prototype, "captureReturn", null);
__decorate([
    (0, common_1.Get)('cancel/:apiCredentialId'),
    __param(0, (0, common_1.Param)('apiCredentialId')),
    __param(1, (0, common_1.Query)('token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], CapturePayPalOrderReturnController.prototype, "cancelReturn", null);
exports.CapturePayPalOrderReturnController = CapturePayPalOrderReturnController = __decorate([
    (0, common_1.Controller)('paypal/checkout'),
    __metadata("design:paramtypes", [capture_paypal_order_return_use_case_1.CapturePayPalOrderReturnUseCase])
], CapturePayPalOrderReturnController);
//# sourceMappingURL=capture-paypal-order-return.controller.js.map