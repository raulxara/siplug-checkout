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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListPaymentTransactionsUseCase = void 0;
const common_1 = require("@nestjs/common");
const handle_use_case_exception_dto_in_1 = require("../../common/services/use-case-support/dtos/handle-use-case-exception.dto-in");
const handle_use_case_exception_service_1 = require("../../common/services/use-case-support/handle-use-case-exception.service");
const get_all_payment_transactions_dto_in_1 = require("../../modules/payment-transactions/services/get-all-payment-transactions/dtos/get-all-payment-transactions.dto-in");
const get_all_payment_transactions_service_1 = require("../../modules/payment-transactions/services/get-all-payment-transactions/get-all-payment-transactions.service");
const resolve_actor_authorization_dto_in_1 = require("../../modules/security/services/resolve-actor-authorization/dtos/resolve-actor-authorization.dto-in");
const resolve_actor_authorization_service_1 = require("../../modules/security/services/resolve-actor-authorization/resolve-actor-authorization.service");
const list_payment_transactions_dto_out_1 = require("./dtos/list-payment-transactions.dto-out");
let ListPaymentTransactionsUseCase = class ListPaymentTransactionsUseCase {
    resolveActorAuthorizationService;
    getAllPaymentTransactionsService;
    handleUseCaseExceptionService;
    constructor(resolveActorAuthorizationService, getAllPaymentTransactionsService, handleUseCaseExceptionService) {
        this.resolveActorAuthorizationService = resolveActorAuthorizationService;
        this.getAllPaymentTransactionsService = getAllPaymentTransactionsService;
        this.handleUseCaseExceptionService = handleUseCaseExceptionService;
    }
    async exec(dtoIn) {
        try {
            await this.resolveActorAuthorizationService.exec(new resolve_actor_authorization_dto_in_1.ResolveActorAuthorizationDtoIn({
                token: dtoIn.token,
                requiredAction: 'listPaymentTransactions',
                requiredEntity: 'payment_transactions',
            }));
            const paymentTransactionsDtoOut = await this.getAllPaymentTransactionsService.exec(new get_all_payment_transactions_dto_in_1.GetAllPaymentTransactionsDtoIn());
            return new list_payment_transactions_dto_out_1.ListPaymentTransactionsDtoOut(paymentTransactionsDtoOut.paymentTransactions);
        }
        catch (error) {
            await this.handleUseCaseExceptionService.exec(new handle_use_case_exception_dto_in_1.HandleUseCaseExceptionDtoIn({
                useCase: 'ListPaymentTransactionsUseCase',
                error,
                appFile: __filename,
                context: {},
            }));
            const message = error instanceof Error
                ? error.message
                : 'error on list payment transactions use case';
            throw new Error(message);
        }
    }
};
exports.ListPaymentTransactionsUseCase = ListPaymentTransactionsUseCase;
exports.ListPaymentTransactionsUseCase = ListPaymentTransactionsUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [resolve_actor_authorization_service_1.ResolveActorAuthorizationService,
        get_all_payment_transactions_service_1.GetAllPaymentTransactionsService,
        handle_use_case_exception_service_1.HandleUseCaseExceptionService])
], ListPaymentTransactionsUseCase);
//# sourceMappingURL=list-payment-transactions.use-case.js.map