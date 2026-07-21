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
exports.GetPaymentTransactionByUniqueIdUseCase = void 0;
const common_1 = require("@nestjs/common");
const handle_use_case_exception_dto_in_1 = require("../../common/services/use-case-support/dtos/handle-use-case-exception.dto-in");
const handle_use_case_exception_service_1 = require("../../common/services/use-case-support/handle-use-case-exception.service");
const find_payment_transaction_by_unique_id_dto_in_1 = require("../../modules/payment-transactions/services/find-payment-transaction-by-unique-id/dtos/find-payment-transaction-by-unique-id.dto-in");
const find_payment_transaction_by_unique_id_service_1 = require("../../modules/payment-transactions/services/find-payment-transaction-by-unique-id/find-payment-transaction-by-unique-id.service");
const resolve_actor_authorization_dto_in_1 = require("../../modules/security/services/resolve-actor-authorization/dtos/resolve-actor-authorization.dto-in");
const resolve_actor_authorization_service_1 = require("../../modules/security/services/resolve-actor-authorization/resolve-actor-authorization.service");
const get_payment_transaction_by_unique_id_dto_out_1 = require("./dtos/get-payment-transaction-by-unique-id.dto-out");
let GetPaymentTransactionByUniqueIdUseCase = class GetPaymentTransactionByUniqueIdUseCase {
    resolveActorAuthorizationService;
    findPaymentTransactionByUniqueIdService;
    handleUseCaseExceptionService;
    constructor(resolveActorAuthorizationService, findPaymentTransactionByUniqueIdService, handleUseCaseExceptionService) {
        this.resolveActorAuthorizationService = resolveActorAuthorizationService;
        this.findPaymentTransactionByUniqueIdService = findPaymentTransactionByUniqueIdService;
        this.handleUseCaseExceptionService = handleUseCaseExceptionService;
    }
    async exec(dtoIn) {
        try {
            await this.resolveActorAuthorizationService.exec(new resolve_actor_authorization_dto_in_1.ResolveActorAuthorizationDtoIn({
                token: dtoIn.token,
                requiredAction: 'getPaymentTransactionByUniqueId',
                requiredEntity: 'payment_transactions',
            }));
            const paymentTransactionDtoOut = await this.findPaymentTransactionByUniqueIdService.exec(new find_payment_transaction_by_unique_id_dto_in_1.FindPaymentTransactionByUniqueIdDtoIn(dtoIn.paymentTransactionId));
            return new get_payment_transaction_by_unique_id_dto_out_1.GetPaymentTransactionByUniqueIdDtoOut(paymentTransactionDtoOut.paymentTransaction);
        }
        catch (error) {
            await this.handleUseCaseExceptionService.exec(new handle_use_case_exception_dto_in_1.HandleUseCaseExceptionDtoIn({
                useCase: 'GetPaymentTransactionByUniqueIdUseCase',
                error,
                appFile: __filename,
                context: {
                    paymentTransactionId: dtoIn.paymentTransactionId,
                },
            }));
            const message = error instanceof Error
                ? error.message
                : 'error on get payment transaction by unique id use case';
            throw new Error(message);
        }
    }
};
exports.GetPaymentTransactionByUniqueIdUseCase = GetPaymentTransactionByUniqueIdUseCase;
exports.GetPaymentTransactionByUniqueIdUseCase = GetPaymentTransactionByUniqueIdUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [resolve_actor_authorization_service_1.ResolveActorAuthorizationService,
        find_payment_transaction_by_unique_id_service_1.FindPaymentTransactionByUniqueIdService,
        handle_use_case_exception_service_1.HandleUseCaseExceptionService])
], GetPaymentTransactionByUniqueIdUseCase);
//# sourceMappingURL=get-payment-transaction-by-unique-id.use-case.js.map