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
exports.UpdatePaymentSplitLifecycleController = void 0;
const common_1 = require("@nestjs/common");
const update_payment_split_lifecycle_dto_in_1 = require("./dtos/update-payment-split-lifecycle.dto-in");
const update_payment_split_lifecycle_request_1 = require("./http/update-payment-split-lifecycle.request");
const update_payment_split_lifecycle_use_case_1 = require("./update-payment-split-lifecycle.use-case");
let UpdatePaymentSplitLifecycleController = class UpdatePaymentSplitLifecycleController {
    updatePaymentSplitLifecycleUseCase;
    constructor(updatePaymentSplitLifecycleUseCase) {
        this.updatePaymentSplitLifecycleUseCase = updatePaymentSplitLifecycleUseCase;
    }
    async handle(request, authorization) {
        const dtoOut = await this.updatePaymentSplitLifecycleUseCase.exec(new update_payment_split_lifecycle_dto_in_1.UpdatePaymentSplitLifecycleDtoIn({
            token: this.resolveToken(authorization, request.token),
            paymentSplitId: request.paymentSplitId,
            status: request.status,
            gatewaySplitId: request.gatewaySplitId,
            providerPayload: request.providerPayload,
            providerResponse: request.providerResponse,
            gatewayResponse: request.gatewayResponse,
            metadata: request.metadata,
            config: request.config,
            recipients: request.recipients,
        }));
        return {
            status: 'success',
            message: 'payment split lifecycle updated successfully',
            data: {
                paymentSplit: dtoOut.paymentSplit,
                paymentSplitRecipients: dtoOut.paymentSplitRecipients,
            },
        };
    }
    resolveToken(authorization, fallbackToken) {
        if (authorization && authorization.startsWith('Bearer ')) {
            return authorization.replace('Bearer ', '').trim();
        }
        return String(fallbackToken ?? '').trim();
    }
};
exports.UpdatePaymentSplitLifecycleController = UpdatePaymentSplitLifecycleController;
__decorate([
    (0, common_1.Put)('update-lifecycle'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Headers)('authorization')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_payment_split_lifecycle_request_1.UpdatePaymentSplitLifecycleRequest, String]),
    __metadata("design:returntype", Promise)
], UpdatePaymentSplitLifecycleController.prototype, "handle", null);
exports.UpdatePaymentSplitLifecycleController = UpdatePaymentSplitLifecycleController = __decorate([
    (0, common_1.Controller)('payment-splits'),
    __metadata("design:paramtypes", [update_payment_split_lifecycle_use_case_1.UpdatePaymentSplitLifecycleUseCase])
], UpdatePaymentSplitLifecycleController);
//# sourceMappingURL=update-payment-split-lifecycle.controller.js.map