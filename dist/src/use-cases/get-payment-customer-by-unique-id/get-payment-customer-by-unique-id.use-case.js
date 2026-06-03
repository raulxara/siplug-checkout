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
exports.GetPaymentCustomerByUniqueIdUseCase = void 0;
const common_1 = require("@nestjs/common");
const handle_use_case_exception_dto_in_1 = require("../../common/services/use-case-support/dtos/handle-use-case-exception.dto-in");
const handle_use_case_exception_service_1 = require("../../common/services/use-case-support/handle-use-case-exception.service");
const find_office_by_unique_id_dto_in_1 = require("../../modules/offices/services/find-office-by-unique-id/dtos/find-office-by-unique-id.dto-in");
const find_office_by_unique_id_service_1 = require("../../modules/offices/services/find-office-by-unique-id/find-office-by-unique-id.service");
const find_payment_customer_by_unique_id_dto_in_1 = require("../../modules/payment-customers/services/find-payment-customer-by-unique-id/dtos/find-payment-customer-by-unique-id.dto-in");
const find_payment_customer_by_unique_id_service_1 = require("../../modules/payment-customers/services/find-payment-customer-by-unique-id/find-payment-customer-by-unique-id.service");
const resolve_actor_authorization_dto_in_1 = require("../../modules/security/services/resolve-actor-authorization/dtos/resolve-actor-authorization.dto-in");
const resolve_actor_authorization_service_1 = require("../../modules/security/services/resolve-actor-authorization/resolve-actor-authorization.service");
const get_payment_customer_by_unique_id_dto_out_1 = require("./dtos/get-payment-customer-by-unique-id.dto-out");
let GetPaymentCustomerByUniqueIdUseCase = class GetPaymentCustomerByUniqueIdUseCase {
    resolveActorAuthorizationService;
    findPaymentCustomerByUniqueIdService;
    findOfficeByUniqueIdService;
    handleUseCaseExceptionService;
    constructor(resolveActorAuthorizationService, findPaymentCustomerByUniqueIdService, findOfficeByUniqueIdService, handleUseCaseExceptionService) {
        this.resolveActorAuthorizationService = resolveActorAuthorizationService;
        this.findPaymentCustomerByUniqueIdService = findPaymentCustomerByUniqueIdService;
        this.findOfficeByUniqueIdService = findOfficeByUniqueIdService;
        this.handleUseCaseExceptionService = handleUseCaseExceptionService;
    }
    async exec(dtoIn) {
        try {
            await this.resolveActorAuthorizationService.exec(new resolve_actor_authorization_dto_in_1.ResolveActorAuthorizationDtoIn({
                token: dtoIn.token,
                requiredAction: 'getPaymentCustomerByUniqueId',
                requiredEntity: 'payment_customers',
            }));
            const paymentCustomerDtoOut = await this.findPaymentCustomerByUniqueIdService.exec(new find_payment_customer_by_unique_id_dto_in_1.FindPaymentCustomerByUniqueIdDtoIn(dtoIn.paymentCustomerId));
            const paymentCustomer = paymentCustomerDtoOut.paymentCustomer;
            const officeDtoOut = await this.findOfficeByUniqueIdService.exec(new find_office_by_unique_id_dto_in_1.FindOfficeByUniqueIdDtoIn(paymentCustomer.officeId));
            if (officeDtoOut.office.status !== 'active') {
                throw new Error('office is not active');
            }
            return new get_payment_customer_by_unique_id_dto_out_1.GetPaymentCustomerByUniqueIdDtoOut(paymentCustomer);
        }
        catch (error) {
            await this.handleUseCaseExceptionService.exec(new handle_use_case_exception_dto_in_1.HandleUseCaseExceptionDtoIn({
                useCase: 'GetPaymentCustomerByUniqueIdUseCase',
                error,
                appFile: __filename,
                context: {
                    paymentCustomerId: dtoIn.paymentCustomerId,
                },
            }));
            const message = error instanceof Error
                ? error.message
                : 'error on get payment customer by unique id use case';
            throw new Error(message);
        }
    }
};
exports.GetPaymentCustomerByUniqueIdUseCase = GetPaymentCustomerByUniqueIdUseCase;
exports.GetPaymentCustomerByUniqueIdUseCase = GetPaymentCustomerByUniqueIdUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [resolve_actor_authorization_service_1.ResolveActorAuthorizationService,
        find_payment_customer_by_unique_id_service_1.FindPaymentCustomerByUniqueIdService,
        find_office_by_unique_id_service_1.FindOfficeByUniqueIdService,
        handle_use_case_exception_service_1.HandleUseCaseExceptionService])
], GetPaymentCustomerByUniqueIdUseCase);
//# sourceMappingURL=get-payment-customer-by-unique-id.use-case.js.map