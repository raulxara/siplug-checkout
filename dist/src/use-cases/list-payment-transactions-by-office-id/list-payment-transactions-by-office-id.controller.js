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
exports.ListPaymentTransactionsByOfficeIdController = void 0;
const common_1 = require("@nestjs/common");
const list_payment_transactions_by_office_id_dto_in_1 = require("./dtos/list-payment-transactions-by-office-id.dto-in");
const list_payment_transactions_by_office_id_request_1 = require("./http/list-payment-transactions-by-office-id.request");
const list_payment_transactions_by_office_id_use_case_1 = require("./list-payment-transactions-by-office-id.use-case");
let ListPaymentTransactionsByOfficeIdController = class ListPaymentTransactionsByOfficeIdController {
    listPaymentTransactionsByOfficeIdUseCase;
    constructor(listPaymentTransactionsByOfficeIdUseCase) {
        this.listPaymentTransactionsByOfficeIdUseCase = listPaymentTransactionsByOfficeIdUseCase;
    }
    async handle(authorization, body) {
        try {
            const dtoOut = await this.listPaymentTransactionsByOfficeIdUseCase.exec(new list_payment_transactions_by_office_id_dto_in_1.ListPaymentTransactionsByOfficeIdDtoIn({
                token: this.extractBearerToken(authorization),
                officeId: body.officeId,
            }));
            return {
                status: 'success',
                message: 'payment transactions listed by office successfully',
                data: {
                    paymentTransactions: dtoOut.paymentTransactions,
                },
            };
        }
        catch (error) {
            const message = error instanceof Error
                ? error.message
                : 'error on list payment transactions by office id';
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
exports.ListPaymentTransactionsByOfficeIdController = ListPaymentTransactionsByOfficeIdController;
__decorate([
    (0, common_1.Post)('list-by-office-id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Headers)('authorization')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, list_payment_transactions_by_office_id_request_1.ListPaymentTransactionsByOfficeIdRequest]),
    __metadata("design:returntype", Promise)
], ListPaymentTransactionsByOfficeIdController.prototype, "handle", null);
exports.ListPaymentTransactionsByOfficeIdController = ListPaymentTransactionsByOfficeIdController = __decorate([
    (0, common_1.Controller)('payment-transactions'),
    __metadata("design:paramtypes", [list_payment_transactions_by_office_id_use_case_1.ListPaymentTransactionsByOfficeIdUseCase])
], ListPaymentTransactionsByOfficeIdController);
//# sourceMappingURL=list-payment-transactions-by-office-id.controller.js.map