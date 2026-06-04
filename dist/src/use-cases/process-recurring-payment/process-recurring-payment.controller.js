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
exports.ProcessRecurringPaymentController = void 0;
const common_1 = require("@nestjs/common");
const process_recurring_payment_dto_in_1 = require("./dtos/process-recurring-payment.dto-in");
const process_recurring_payment_request_1 = require("./http/process-recurring-payment.request");
const process_recurring_payment_use_case_1 = require("./process-recurring-payment.use-case");
let ProcessRecurringPaymentController = class ProcessRecurringPaymentController {
    processRecurringPaymentUseCase;
    constructor(processRecurringPaymentUseCase) {
        this.processRecurringPaymentUseCase = processRecurringPaymentUseCase;
    }
    async handle(authorization, body) {
        try {
            const dtoOut = await this.processRecurringPaymentUseCase.exec(new process_recurring_payment_dto_in_1.ProcessRecurringPaymentDtoIn({
                token: this.extractBearerToken(authorization),
                checkoutSessionId: body.checkoutSessionId,
                paymentMethod: body.paymentMethod,
                gatewayProvider: body.gatewayProvider ?? null,
                gatewaySlug: body.gatewaySlug ?? null,
                gatewayId: body.gatewayId ?? null,
                apiCredentialId: body.apiCredentialId ?? null,
                payer: body.payer ?? null,
                paymentData: body.paymentData ?? null,
                metadata: body.metadata ?? null,
                config: body.config ?? null,
            }));
            return {
                status: 'success',
                message: 'recurring payment processed successfully',
                data: {
                    subscription: dtoOut.subscription,
                    subscriptionCycle: dtoOut.subscriptionCycle,
                    subscriptionInvoice: dtoOut.subscriptionInvoice,
                    paymentTransaction: dtoOut.paymentTransaction,
                    checkoutSession: dtoOut.checkoutSession,
                },
            };
        }
        catch (error) {
            const message = error instanceof Error
                ? error.message
                : 'error on process recurring payment';
            throw new common_1.BadRequestException({
                status: 'error',
                message,
            });
        }
    }
    extractBearerToken(authorization) {
        if (!authorization || authorization.trim() === '') {
            throw new Error('authorization header is required');
        }
        return authorization.replace(/^Bearer\s+/i, '').trim();
    }
};
exports.ProcessRecurringPaymentController = ProcessRecurringPaymentController;
__decorate([
    (0, common_1.Post)('process-recurring'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Headers)('authorization')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, process_recurring_payment_request_1.ProcessRecurringPaymentRequest]),
    __metadata("design:returntype", Promise)
], ProcessRecurringPaymentController.prototype, "handle", null);
exports.ProcessRecurringPaymentController = ProcessRecurringPaymentController = __decorate([
    (0, common_1.Controller)('payments'),
    __metadata("design:paramtypes", [process_recurring_payment_use_case_1.ProcessRecurringPaymentUseCase])
], ProcessRecurringPaymentController);
//# sourceMappingURL=process-recurring-payment.controller.js.map