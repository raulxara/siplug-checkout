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
exports.UpdatePaymentCustomerUseCase = void 0;
const common_1 = require("@nestjs/common");
const handle_use_case_exception_dto_in_1 = require("../../common/services/use-case-support/dtos/handle-use-case-exception.dto-in");
const handle_use_case_exception_service_1 = require("../../common/services/use-case-support/handle-use-case-exception.service");
const find_client_by_unique_id_dto_in_1 = require("../../modules/clients/services/find-client-by-unique-id/dtos/find-client-by-unique-id.dto-in");
const find_client_by_unique_id_service_1 = require("../../modules/clients/services/find-client-by-unique-id/find-client-by-unique-id.service");
const find_office_by_unique_id_dto_in_1 = require("../../modules/offices/services/find-office-by-unique-id/dtos/find-office-by-unique-id.dto-in");
const find_office_by_unique_id_service_1 = require("../../modules/offices/services/find-office-by-unique-id/find-office-by-unique-id.service");
const find_payment_customer_by_unique_id_dto_in_1 = require("../../modules/payment-customers/services/find-payment-customer-by-unique-id/dtos/find-payment-customer-by-unique-id.dto-in");
const find_payment_customer_by_unique_id_service_1 = require("../../modules/payment-customers/services/find-payment-customer-by-unique-id/find-payment-customer-by-unique-id.service");
const update_payment_customer_dto_in_1 = require("../../modules/payment-customers/services/update-payment-customer/dtos/update-payment-customer.dto-in");
const update_payment_customer_service_1 = require("../../modules/payment-customers/services/update-payment-customer/update-payment-customer.service");
const find_profile_by_unique_id_dto_in_1 = require("../../modules/profiles/services/find-profile-by-unique-id/dtos/find-profile-by-unique-id.dto-in");
const find_profile_by_unique_id_service_1 = require("../../modules/profiles/services/find-profile-by-unique-id/find-profile-by-unique-id.service");
const resolve_actor_authorization_dto_in_1 = require("../../modules/security/services/resolve-actor-authorization/dtos/resolve-actor-authorization.dto-in");
const resolve_actor_authorization_service_1 = require("../../modules/security/services/resolve-actor-authorization/resolve-actor-authorization.service");
const update_payment_customer_dto_out_1 = require("./dtos/update-payment-customer.dto-out");
let UpdatePaymentCustomerUseCase = class UpdatePaymentCustomerUseCase {
    resolveActorAuthorizationService;
    findPaymentCustomerByUniqueIdService;
    findOfficeByUniqueIdService;
    findClientByUniqueIdService;
    findProfileByUniqueIdService;
    updatePaymentCustomerService;
    handleUseCaseExceptionService;
    constructor(resolveActorAuthorizationService, findPaymentCustomerByUniqueIdService, findOfficeByUniqueIdService, findClientByUniqueIdService, findProfileByUniqueIdService, updatePaymentCustomerService, handleUseCaseExceptionService) {
        this.resolveActorAuthorizationService = resolveActorAuthorizationService;
        this.findPaymentCustomerByUniqueIdService = findPaymentCustomerByUniqueIdService;
        this.findOfficeByUniqueIdService = findOfficeByUniqueIdService;
        this.findClientByUniqueIdService = findClientByUniqueIdService;
        this.findProfileByUniqueIdService = findProfileByUniqueIdService;
        this.updatePaymentCustomerService = updatePaymentCustomerService;
        this.handleUseCaseExceptionService = handleUseCaseExceptionService;
    }
    async exec(dtoIn) {
        try {
            await this.resolveActorAuthorizationService.exec(new resolve_actor_authorization_dto_in_1.ResolveActorAuthorizationDtoIn({
                token: dtoIn.token,
                requiredAction: 'updatePaymentCustomer',
                requiredEntity: 'payment_customers',
            }));
            const currentPaymentCustomerDtoOut = await this.findPaymentCustomerByUniqueIdService.exec(new find_payment_customer_by_unique_id_dto_in_1.FindPaymentCustomerByUniqueIdDtoIn(dtoIn.paymentCustomerId));
            const currentPaymentCustomer = currentPaymentCustomerDtoOut.paymentCustomer;
            const effectiveOfficeId = dtoIn.officeId ?? currentPaymentCustomer.officeId;
            const effectiveClientId = dtoIn.clientId ?? currentPaymentCustomer.clientId;
            if (effectiveOfficeId.trim() === '') {
                throw new Error('officeId is required');
            }
            if (effectiveClientId.trim() === '') {
                throw new Error('clientId is required');
            }
            if (dtoIn.officeId !== null) {
                const officeDtoOut = await this.findOfficeByUniqueIdService.exec(new find_office_by_unique_id_dto_in_1.FindOfficeByUniqueIdDtoIn(dtoIn.officeId));
                if (officeDtoOut.office.status !== 'active') {
                    throw new Error('office is not active');
                }
            }
            const clientDtoOut = await this.findClientByUniqueIdService.exec(new find_client_by_unique_id_dto_in_1.FindClientByUniqueIdDtoIn(effectiveClientId));
            if (clientDtoOut.client.status !== 'active') {
                throw new Error('client is not active');
            }
            if (clientDtoOut.client.officeId !== effectiveOfficeId) {
                throw new Error('client does not belong to office');
            }
            if (dtoIn.profileId !== null) {
                const profileDtoOut = await this.findProfileByUniqueIdService.exec(new find_profile_by_unique_id_dto_in_1.FindProfileByUniqueIdDtoIn(dtoIn.profileId));
                if (profileDtoOut.profile.status !== 'active') {
                    throw new Error('profile is not active');
                }
            }
            const updatedPaymentCustomerDtoOut = await this.updatePaymentCustomerService.exec(new update_payment_customer_dto_in_1.UpdatePaymentCustomerDtoIn({
                _id: dtoIn.paymentCustomerId,
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
                source: dtoIn.source,
            }));
            return new update_payment_customer_dto_out_1.UpdatePaymentCustomerDtoOut(updatedPaymentCustomerDtoOut.paymentCustomer);
        }
        catch (error) {
            await this.handleUseCaseExceptionService.exec(new handle_use_case_exception_dto_in_1.HandleUseCaseExceptionDtoIn({
                useCase: 'UpdatePaymentCustomerUseCase',
                error,
                appFile: __filename,
                context: {
                    paymentCustomerId: dtoIn.paymentCustomerId,
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
                    source: dtoIn.source,
                },
            }));
            const message = error instanceof Error
                ? error.message
                : 'error on update payment customer use case';
            throw new Error(message);
        }
    }
};
exports.UpdatePaymentCustomerUseCase = UpdatePaymentCustomerUseCase;
exports.UpdatePaymentCustomerUseCase = UpdatePaymentCustomerUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [resolve_actor_authorization_service_1.ResolveActorAuthorizationService,
        find_payment_customer_by_unique_id_service_1.FindPaymentCustomerByUniqueIdService,
        find_office_by_unique_id_service_1.FindOfficeByUniqueIdService,
        find_client_by_unique_id_service_1.FindClientByUniqueIdService,
        find_profile_by_unique_id_service_1.FindProfileByUniqueIdService,
        update_payment_customer_service_1.UpdatePaymentCustomerService,
        handle_use_case_exception_service_1.HandleUseCaseExceptionService])
], UpdatePaymentCustomerUseCase);
//# sourceMappingURL=update-payment-customer.use-case.js.map