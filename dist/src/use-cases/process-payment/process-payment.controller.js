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
exports.ProcessPaymentController = void 0;
const common_1 = require("@nestjs/common");
const process_payment_dto_in_1 = require("./dtos/process-payment.dto-in");
const process_payment_request_1 = require("./http/process-payment.request");
const process_payment_use_case_1 = require("./process-payment.use-case");
let ProcessPaymentController = class ProcessPaymentController {
    processPaymentUseCase;
    constructor(processPaymentUseCase) {
        this.processPaymentUseCase = processPaymentUseCase;
    }
    async handle(body, authorization) {
        try {
            const token = body.token ??
                authorization?.replace(/^Bearer\s+/i, '').trim() ??
                '';
            const dtoOut = await this.processPaymentUseCase.exec(new process_payment_dto_in_1.ProcessPaymentDtoIn({
                token,
                checkoutSessionId: body.checkoutSessionId,
                paymentMethod: body.paymentMethod,
                installments: body.installments ?? null,
                installmentAmount: body.installmentAmount ?? null,
                interestAmount: body.interestAmount ?? null,
                interestType: body.interestType ?? null,
                idempotencyKey: body.idempotencyKey ?? null,
                externalReference: body.externalReference ?? null,
                payer: body.payer ?? null,
                paymentData: body.paymentData ?? null,
                metadata: body.metadata ?? null,
                config: body.config ?? null,
            }));
            return {
                status: 'success',
                message: 'payment processed successfully',
                data: dtoOut,
            };
        }
        catch (error) {
            const message = error instanceof Error
                ? error.message
                : 'error on process payment controller';
            throw new common_1.BadRequestException({
                status: 'error',
                message,
            });
        }
    }
};
exports.ProcessPaymentController = ProcessPaymentController;
__decorate([
    (0, common_1.Post)('process'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Headers)('authorization')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [process_payment_request_1.ProcessPaymentRequest, String]),
    __metadata("design:returntype", Promise)
], ProcessPaymentController.prototype, "handle", null);
exports.ProcessPaymentController = ProcessPaymentController = __decorate([
    (0, common_1.Controller)('payments'),
    __metadata("design:paramtypes", [process_payment_use_case_1.ProcessPaymentUseCase])
], ProcessPaymentController);
//# sourceMappingURL=process-payment.controller.js.map