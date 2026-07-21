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
exports.UpdateSubscriptionInvoiceController = void 0;
const common_1 = require("@nestjs/common");
const update_subscription_invoice_dto_in_1 = require("./dtos/update-subscription-invoice.dto-in");
const update_subscription_invoice_request_1 = require("./http/update-subscription-invoice.request");
const update_subscription_invoice_use_case_1 = require("./update-subscription-invoice.use-case");
let UpdateSubscriptionInvoiceController = class UpdateSubscriptionInvoiceController {
    updateSubscriptionInvoiceUseCase;
    constructor(updateSubscriptionInvoiceUseCase) {
        this.updateSubscriptionInvoiceUseCase = updateSubscriptionInvoiceUseCase;
    }
    async handle(request, authorization) {
        const dtoOut = await this.updateSubscriptionInvoiceUseCase.exec(new update_subscription_invoice_dto_in_1.UpdateSubscriptionInvoiceDtoIn({
            token: this.resolveToken(authorization, request.token),
            subscriptionInvoiceId: request.subscriptionInvoiceId ?? request._id,
            paymentTransactionId: request.paymentTransactionId,
            gatewayInvoiceId: request.gatewayInvoiceId,
            paidAt: request.paidAt,
            dueAt: request.dueAt,
            lastAttemptAt: request.lastAttemptAt,
            attemptNumber: request.attemptNumber,
            metadata: request.metadata,
            config: request.config,
            status: request.status,
        }));
        return {
            status: 'success',
            message: 'subscription invoice updated successfully',
            data: {
                subscriptionInvoice: dtoOut.subscriptionInvoice,
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
exports.UpdateSubscriptionInvoiceController = UpdateSubscriptionInvoiceController;
__decorate([
    (0, common_1.Put)('update'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Headers)('authorization')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_subscription_invoice_request_1.UpdateSubscriptionInvoiceRequest, String]),
    __metadata("design:returntype", Promise)
], UpdateSubscriptionInvoiceController.prototype, "handle", null);
exports.UpdateSubscriptionInvoiceController = UpdateSubscriptionInvoiceController = __decorate([
    (0, common_1.Controller)('subscription-invoices'),
    __metadata("design:paramtypes", [update_subscription_invoice_use_case_1.UpdateSubscriptionInvoiceUseCase])
], UpdateSubscriptionInvoiceController);
//# sourceMappingURL=update-subscription-invoice.controller.js.map