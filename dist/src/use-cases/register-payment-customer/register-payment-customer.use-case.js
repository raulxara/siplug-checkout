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
exports.RegisterPaymentCustomerUseCase = void 0;
const common_1 = require("@nestjs/common");
const handle_use_case_exception_dto_in_1 = require("../../common/services/use-case-support/dtos/handle-use-case-exception.dto-in");
const handle_use_case_exception_service_1 = require("../../common/services/use-case-support/handle-use-case-exception.service");
const find_client_by_unique_id_dto_in_1 = require("../../modules/clients/services/find-client-by-unique-id/dtos/find-client-by-unique-id.dto-in");
const find_client_by_unique_id_service_1 = require("../../modules/clients/services/find-client-by-unique-id/find-client-by-unique-id.service");
const find_office_by_unique_id_dto_in_1 = require("../../modules/offices/services/find-office-by-unique-id/dtos/find-office-by-unique-id.dto-in");
const find_office_by_unique_id_service_1 = require("../../modules/offices/services/find-office-by-unique-id/find-office-by-unique-id.service");
const create_payment_customer_dto_in_1 = require("../../modules/payment-customers/services/create-payment-customer/dtos/create-payment-customer.dto-in");
const create_payment_customer_service_1 = require("../../modules/payment-customers/services/create-payment-customer/create-payment-customer.service");
const find_profile_by_unique_id_dto_in_1 = require("../../modules/profiles/services/find-profile-by-unique-id/dtos/find-profile-by-unique-id.dto-in");
const find_profile_by_unique_id_service_1 = require("../../modules/profiles/services/find-profile-by-unique-id/find-profile-by-unique-id.service");
const resolve_actor_authorization_dto_in_1 = require("../../modules/security/services/resolve-actor-authorization/dtos/resolve-actor-authorization.dto-in");
const resolve_actor_authorization_service_1 = require("../../modules/security/services/resolve-actor-authorization/resolve-actor-authorization.service");
const register_payment_customer_dto_out_1 = require("./dtos/register-payment-customer.dto-out");
let RegisterPaymentCustomerUseCase = class RegisterPaymentCustomerUseCase {
    resolveActorAuthorizationService;
    findOfficeByUniqueIdService;
    findClientByUniqueIdService;
    findProfileByUniqueIdService;
    createPaymentCustomerService;
    handleUseCaseExceptionService;
    constructor(resolveActorAuthorizationService, findOfficeByUniqueIdService, findClientByUniqueIdService, findProfileByUniqueIdService, createPaymentCustomerService, handleUseCaseExceptionService) {
        this.resolveActorAuthorizationService = resolveActorAuthorizationService;
        this.findOfficeByUniqueIdService = findOfficeByUniqueIdService;
        this.findClientByUniqueIdService = findClientByUniqueIdService;
        this.findProfileByUniqueIdService = findProfileByUniqueIdService;
        this.createPaymentCustomerService = createPaymentCustomerService;
        this.handleUseCaseExceptionService = handleUseCaseExceptionService;
    }
    async exec(dtoIn) {
        try {
            await this.resolveActorAuthorizationService.exec(new resolve_actor_authorization_dto_in_1.ResolveActorAuthorizationDtoIn({
                token: dtoIn.token,
                requiredAction: 'registerPaymentCustomer',
                requiredEntity: 'payment_customers',
            }));
            const officeDtoOut = await this.findOfficeByUniqueIdService.exec(new find_office_by_unique_id_dto_in_1.FindOfficeByUniqueIdDtoIn(dtoIn.officeId));
            if (officeDtoOut.office.status !== 'active') {
                throw new Error('office is not active');
            }
            const clientDtoOut = await this.findClientByUniqueIdService.exec(new find_client_by_unique_id_dto_in_1.FindClientByUniqueIdDtoIn(dtoIn.clientId));
            if (clientDtoOut.client.status !== 'active') {
                throw new Error('client is not active');
            }
            if (clientDtoOut.client.officeId !== dtoIn.officeId) {
                throw new Error('client does not belong to office');
            }
            if (dtoIn.profileId !== null) {
                const profileDtoOut = await this.findProfileByUniqueIdService.exec(new find_profile_by_unique_id_dto_in_1.FindProfileByUniqueIdDtoIn(dtoIn.profileId));
                if (profileDtoOut.profile.status !== 'active') {
                    throw new Error('profile is not active');
                }
            }
            const paymentCustomerDtoOut = await this.createPaymentCustomerService.exec(new create_payment_customer_dto_in_1.CreatePaymentCustomerDtoIn({
                officeId: dtoIn.officeId,
                clientId: dtoIn.clientId,
                profileId: dtoIn.profileId,
                externalReference: dtoIn.externalReference,
                name: dtoIn.name,
                email: dtoIn.email,
                documentType: dtoIn.documentType,
                documentValue: dtoIn.documentValue,
                phone: dtoIn.phone,
                billingAddress: dtoIn.billingAddress,
                metadata: dtoIn.metadata,
                config: dtoIn.config,
                status: dtoIn.status,
            }));
            return register_payment_customer_dto_out_1.RegisterPaymentCustomerDtoOut.fromCreatePaymentCustomerDtoOut(paymentCustomerDtoOut);
        }
        catch (error) {
            await this.handleUseCaseExceptionService.exec(new handle_use_case_exception_dto_in_1.HandleUseCaseExceptionDtoIn({
                useCase: 'RegisterPaymentCustomerUseCase',
                error,
                appFile: __filename,
                context: {
                    officeId: dtoIn.officeId,
                    clientId: dtoIn.clientId,
                    profileId: dtoIn.profileId,
                    externalReference: dtoIn.externalReference,
                    name: dtoIn.name,
                    email: dtoIn.email,
                    documentType: dtoIn.documentType,
                    hasDocumentValue: dtoIn.documentValue !== null,
                    phone: dtoIn.phone,
                    hasBillingAddress: dtoIn.billingAddress !== null,
                    status: dtoIn.status,
                },
            }));
            const message = error instanceof Error
                ? error.message
                : 'error on register payment customer use case';
            throw new Error(message);
        }
    }
};
exports.RegisterPaymentCustomerUseCase = RegisterPaymentCustomerUseCase;
exports.RegisterPaymentCustomerUseCase = RegisterPaymentCustomerUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [resolve_actor_authorization_service_1.ResolveActorAuthorizationService,
        find_office_by_unique_id_service_1.FindOfficeByUniqueIdService,
        find_client_by_unique_id_service_1.FindClientByUniqueIdService,
        find_profile_by_unique_id_service_1.FindProfileByUniqueIdService,
        create_payment_customer_service_1.CreatePaymentCustomerService,
        handle_use_case_exception_service_1.HandleUseCaseExceptionService])
], RegisterPaymentCustomerUseCase);
//# sourceMappingURL=register-payment-customer.use-case.js.map