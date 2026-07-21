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
exports.GetPaymentCustomersByOfficeIdUseCase = void 0;
const common_1 = require("@nestjs/common");
const handle_use_case_exception_dto_in_1 = require("../../common/services/use-case-support/dtos/handle-use-case-exception.dto-in");
const handle_use_case_exception_service_1 = require("../../common/services/use-case-support/handle-use-case-exception.service");
const find_office_by_unique_id_dto_in_1 = require("../../modules/offices/services/find-office-by-unique-id/dtos/find-office-by-unique-id.dto-in");
const find_office_by_unique_id_service_1 = require("../../modules/offices/services/find-office-by-unique-id/find-office-by-unique-id.service");
const get_all_payment_customers_by_office_id_dto_in_1 = require("../../modules/payment-customers/services/get-all-payment-customers-by-office-id/dtos/get-all-payment-customers-by-office-id.dto-in");
const get_all_payment_customers_by_office_id_service_1 = require("../../modules/payment-customers/services/get-all-payment-customers-by-office-id/get-all-payment-customers-by-office-id.service");
const resolve_actor_authorization_dto_in_1 = require("../../modules/security/services/resolve-actor-authorization/dtos/resolve-actor-authorization.dto-in");
const resolve_actor_authorization_service_1 = require("../../modules/security/services/resolve-actor-authorization/resolve-actor-authorization.service");
const get_payment_customers_by_office_id_dto_out_1 = require("./dtos/get-payment-customers-by-office-id.dto-out");
let GetPaymentCustomersByOfficeIdUseCase = class GetPaymentCustomersByOfficeIdUseCase {
    resolveActorAuthorizationService;
    getAllPaymentCustomersByOfficeIdService;
    findOfficeByUniqueIdService;
    handleUseCaseExceptionService;
    constructor(resolveActorAuthorizationService, getAllPaymentCustomersByOfficeIdService, findOfficeByUniqueIdService, handleUseCaseExceptionService) {
        this.resolveActorAuthorizationService = resolveActorAuthorizationService;
        this.getAllPaymentCustomersByOfficeIdService = getAllPaymentCustomersByOfficeIdService;
        this.findOfficeByUniqueIdService = findOfficeByUniqueIdService;
        this.handleUseCaseExceptionService = handleUseCaseExceptionService;
    }
    async exec(dtoIn) {
        try {
            await this.resolveActorAuthorizationService.exec(new resolve_actor_authorization_dto_in_1.ResolveActorAuthorizationDtoIn({
                token: dtoIn.token,
                requiredAction: 'getPaymentCustomersByOfficeId',
                requiredEntity: 'payment_customers',
            }));
            const officeDtoOut = await this.findOfficeByUniqueIdService.exec(new find_office_by_unique_id_dto_in_1.FindOfficeByUniqueIdDtoIn(dtoIn.officeId));
            if (officeDtoOut.office.status !== 'active') {
                throw new Error('office is not active');
            }
            const paymentCustomersDtoOut = await this.getAllPaymentCustomersByOfficeIdService.exec(new get_all_payment_customers_by_office_id_dto_in_1.GetAllPaymentCustomersByOfficeIdDtoIn(dtoIn.officeId));
            return new get_payment_customers_by_office_id_dto_out_1.GetPaymentCustomersByOfficeIdDtoOut(paymentCustomersDtoOut.items, paymentCustomersDtoOut.total);
        }
        catch (error) {
            await this.handleUseCaseExceptionService.exec(new handle_use_case_exception_dto_in_1.HandleUseCaseExceptionDtoIn({
                useCase: 'GetPaymentCustomersByOfficeIdUseCase',
                error,
                appFile: __filename,
                context: {
                    officeId: dtoIn.officeId,
                },
            }));
            const message = error instanceof Error
                ? error.message
                : 'error on get payment customers by office id use case';
            throw new Error(message);
        }
    }
};
exports.GetPaymentCustomersByOfficeIdUseCase = GetPaymentCustomersByOfficeIdUseCase;
exports.GetPaymentCustomersByOfficeIdUseCase = GetPaymentCustomersByOfficeIdUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [resolve_actor_authorization_service_1.ResolveActorAuthorizationService,
        get_all_payment_customers_by_office_id_service_1.GetAllPaymentCustomersByOfficeIdService,
        find_office_by_unique_id_service_1.FindOfficeByUniqueIdService,
        handle_use_case_exception_service_1.HandleUseCaseExceptionService])
], GetPaymentCustomersByOfficeIdUseCase);
//# sourceMappingURL=get-payment-customers-by-office-id.use-case.js.map