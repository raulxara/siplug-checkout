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
exports.GetPaymentTransactionByUniqueIdController = void 0;
const common_1 = require("@nestjs/common");
const get_payment_transaction_by_unique_id_dto_in_1 = require("./dtos/get-payment-transaction-by-unique-id.dto-in");
const get_payment_transaction_by_unique_id_request_1 = require("./http/get-payment-transaction-by-unique-id.request");
const get_payment_transaction_by_unique_id_use_case_1 = require("./get-payment-transaction-by-unique-id.use-case");
let GetPaymentTransactionByUniqueIdController = class GetPaymentTransactionByUniqueIdController {
    getPaymentTransactionByUniqueIdUseCase;
    constructor(getPaymentTransactionByUniqueIdUseCase) {
        this.getPaymentTransactionByUniqueIdUseCase = getPaymentTransactionByUniqueIdUseCase;
    }
    async handle(authorization, body) {
        try {
            const dtoOut = await this.getPaymentTransactionByUniqueIdUseCase.exec(new get_payment_transaction_by_unique_id_dto_in_1.GetPaymentTransactionByUniqueIdDtoIn({
                token: this.extractBearerToken(authorization),
                paymentTransactionId: body.paymentTransactionId,
            }));
            return {
                status: 'success',
                message: 'payment transaction found successfully',
                data: {
                    paymentTransaction: dtoOut.paymentTransaction,
                },
            };
        }
        catch (error) {
            const message = error instanceof Error
                ? error.message
                : 'error on get payment transaction by unique id';
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
exports.GetPaymentTransactionByUniqueIdController = GetPaymentTransactionByUniqueIdController;
__decorate([
    (0, common_1.Post)('get-by-unique-id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Headers)('authorization')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, get_payment_transaction_by_unique_id_request_1.GetPaymentTransactionByUniqueIdRequest]),
    __metadata("design:returntype", Promise)
], GetPaymentTransactionByUniqueIdController.prototype, "handle", null);
exports.GetPaymentTransactionByUniqueIdController = GetPaymentTransactionByUniqueIdController = __decorate([
    (0, common_1.Controller)('payment-transactions'),
    __metadata("design:paramtypes", [get_payment_transaction_by_unique_id_use_case_1.GetPaymentTransactionByUniqueIdUseCase])
], GetPaymentTransactionByUniqueIdController);
//# sourceMappingURL=get-payment-transaction-by-unique-id.controller.js.map