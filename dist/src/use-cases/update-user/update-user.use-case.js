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
exports.UpdateUserUseCase = void 0;
const common_1 = require("@nestjs/common");
const handle_use_case_exception_dto_in_1 = require("../../common/services/use-case-support/dtos/handle-use-case-exception.dto-in");
const handle_use_case_exception_service_1 = require("../../common/services/use-case-support/handle-use-case-exception.service");
const find_client_by_unique_id_dto_in_1 = require("../../modules/clients/services/find-client-by-unique-id/dtos/find-client-by-unique-id.dto-in");
const find_client_by_unique_id_service_1 = require("../../modules/clients/services/find-client-by-unique-id/find-client-by-unique-id.service");
const update_client_dto_in_1 = require("../../modules/clients/services/update-client/dtos/update-client.dto-in");
const update_client_service_1 = require("../../modules/clients/services/update-client/update-client.service");
const validate_client_username_uniqueness_dto_in_1 = require("../../modules/clients/services/validate-client-username-uniqueness/dtos/validate-client-username-uniqueness.dto-in");
const validate_client_username_uniqueness_service_1 = require("../../modules/clients/services/validate-client-username-uniqueness/validate-client-username-uniqueness.service");
const find_office_by_unique_id_dto_in_1 = require("../../modules/offices/services/find-office-by-unique-id/dtos/find-office-by-unique-id.dto-in");
const find_office_by_unique_id_service_1 = require("../../modules/offices/services/find-office-by-unique-id/find-office-by-unique-id.service");
const find_position_by_slug_dto_in_1 = require("../../modules/positions/services/find-position-by-slug/dtos/find-position-by-slug.dto-in");
const find_position_by_slug_service_1 = require("../../modules/positions/services/find-position-by-slug/find-position-by-slug.service");
const find_profile_by_unique_id_dto_in_1 = require("../../modules/profiles/services/find-profile-by-unique-id/dtos/find-profile-by-unique-id.dto-in");
const find_profile_by_unique_id_service_1 = require("../../modules/profiles/services/find-profile-by-unique-id/find-profile-by-unique-id.service");
const update_profile_dto_in_1 = require("../../modules/profiles/services/update-profile/dtos/update-profile.dto-in");
const update_profile_service_1 = require("../../modules/profiles/services/update-profile/update-profile.service");
const validate_profile_email_uniqueness_dto_in_1 = require("../../modules/profiles/services/validate-profile-email-uniqueness/dtos/validate-profile-email-uniqueness.dto-in");
const validate_profile_email_uniqueness_service_1 = require("../../modules/profiles/services/validate-profile-email-uniqueness/validate-profile-email-uniqueness.service");
const resolve_actor_authorization_dto_in_1 = require("../../modules/security/services/resolve-actor-authorization/dtos/resolve-actor-authorization.dto-in");
const resolve_actor_authorization_service_1 = require("../../modules/security/services/resolve-actor-authorization/resolve-actor-authorization.service");
const find_user_customer_by_unique_id_dto_in_1 = require("../../modules/user-customers/services/find-user-customer-by-unique-id/dtos/find-user-customer-by-unique-id.dto-in");
const find_user_customer_by_unique_id_service_1 = require("../../modules/user-customers/services/find-user-customer-by-unique-id/find-user-customer-by-unique-id.service");
const update_user_customer_dto_in_1 = require("../../modules/user-customers/services/update-user-customer/dtos/update-user-customer.dto-in");
const update_user_customer_service_1 = require("../../modules/user-customers/services/update-user-customer/update-user-customer.service");
const create_user_position_dto_in_1 = require("../../modules/user-positions/services/create-user-position/dtos/create-user-position.dto-in");
const create_user_position_service_1 = require("../../modules/user-positions/services/create-user-position/create-user-position.service");
const get_all_user_positions_by_user_customer_id_dto_in_1 = require("../../modules/user-positions/services/get-all-user-positions-by-user-customer-id/dtos/get-all-user-positions-by-user-customer-id.dto-in");
const get_all_user_positions_by_user_customer_id_service_1 = require("../../modules/user-positions/services/get-all-user-positions-by-user-customer-id/get-all-user-positions-by-user-customer-id.service");
const update_user_position_dto_in_1 = require("../../modules/user-positions/services/update-user-position/dtos/update-user-position.dto-in");
const update_user_position_service_1 = require("../../modules/user-positions/services/update-user-position/update-user-position.service");
const update_user_dto_out_1 = require("./dtos/update-user.dto-out");
let UpdateUserUseCase = class UpdateUserUseCase {
    resolveActorAuthorizationService;
    findUserCustomerByUniqueIdService;
    updateUserCustomerService;
    findClientByUniqueIdService;
    updateClientService;
    validateClientUsernameUniquenessService;
    findProfileByUniqueIdService;
    updateProfileService;
    validateProfileEmailUniquenessService;
    findOfficeByUniqueIdService;
    findPositionBySlugService;
    getAllUserPositionsByUserCustomerIdService;
    createUserPositionService;
    updateUserPositionService;
    handleUseCaseExceptionService;
    constructor(resolveActorAuthorizationService, findUserCustomerByUniqueIdService, updateUserCustomerService, findClientByUniqueIdService, updateClientService, validateClientUsernameUniquenessService, findProfileByUniqueIdService, updateProfileService, validateProfileEmailUniquenessService, findOfficeByUniqueIdService, findPositionBySlugService, getAllUserPositionsByUserCustomerIdService, createUserPositionService, updateUserPositionService, handleUseCaseExceptionService) {
        this.resolveActorAuthorizationService = resolveActorAuthorizationService;
        this.findUserCustomerByUniqueIdService = findUserCustomerByUniqueIdService;
        this.updateUserCustomerService = updateUserCustomerService;
        this.findClientByUniqueIdService = findClientByUniqueIdService;
        this.updateClientService = updateClientService;
        this.validateClientUsernameUniquenessService = validateClientUsernameUniquenessService;
        this.findProfileByUniqueIdService = findProfileByUniqueIdService;
        this.updateProfileService = updateProfileService;
        this.validateProfileEmailUniquenessService = validateProfileEmailUniquenessService;
        this.findOfficeByUniqueIdService = findOfficeByUniqueIdService;
        this.findPositionBySlugService = findPositionBySlugService;
        this.getAllUserPositionsByUserCustomerIdService = getAllUserPositionsByUserCustomerIdService;
        this.createUserPositionService = createUserPositionService;
        this.updateUserPositionService = updateUserPositionService;
        this.handleUseCaseExceptionService = handleUseCaseExceptionService;
    }
    async exec(dtoIn) {
        try {
            await this.resolveActorAuthorizationService.exec(new resolve_actor_authorization_dto_in_1.ResolveActorAuthorizationDtoIn({
                token: dtoIn.token,
                requiredAction: 'updateUser',
                requiredEntity: 'user_customers',
            }));
            const currentUserCustomerDtoOut = await this.findUserCustomerByUniqueIdService.exec(new find_user_customer_by_unique_id_dto_in_1.FindUserCustomerByUniqueIdDtoIn(dtoIn.userCustomerId));
            const currentUserCustomer = currentUserCustomerDtoOut.userCustomer;
            const currentClientDtoOut = await this.findClientByUniqueIdService.exec(new find_client_by_unique_id_dto_in_1.FindClientByUniqueIdDtoIn(currentUserCustomer.clientId));
            const currentClient = currentClientDtoOut.client;
            const currentProfileDtoOut = await this.findProfileByUniqueIdService.exec(new find_profile_by_unique_id_dto_in_1.FindProfileByUniqueIdDtoIn(currentUserCustomer.profileId));
            const currentProfile = currentProfileDtoOut.profile;
            const effectiveOfficeId = dtoIn.officeId ?? currentClient.officeId;
            if (!effectiveOfficeId || effectiveOfficeId.trim() === '') {
                throw new Error('officeId is required');
            }
            if (dtoIn.officeId !== null) {
                const officeDtoOut = await this.findOfficeByUniqueIdService.exec(new find_office_by_unique_id_dto_in_1.FindOfficeByUniqueIdDtoIn(dtoIn.officeId));
                if (officeDtoOut.office.status !== 'active') {
                    throw new Error('office is not active');
                }
            }
            if (dtoIn.email !== null && dtoIn.email !== currentProfile.email) {
                await this.validateProfileEmailUniquenessService.exec(new validate_profile_email_uniqueness_dto_in_1.ValidateProfileEmailUniquenessDtoIn(dtoIn.email));
            }
            if (dtoIn.username !== null &&
                dtoIn.username !== currentClient.username) {
                await this.validateClientUsernameUniquenessService.exec(new validate_client_username_uniqueness_dto_in_1.ValidateClientUsernameUniquenessDtoIn(dtoIn.username));
            }
            const updatedProfileDtoOut = await this.updateProfileService.exec(new update_profile_dto_in_1.UpdateProfileDtoIn({
                _id: currentProfile._id,
                firstName: dtoIn.firstName,
                lastName: dtoIn.lastName,
                email: dtoIn.email,
                phone: dtoIn.phone,
                documentType: dtoIn.documentType,
                documentValue: dtoIn.documentValue,
                config: dtoIn.profileConfig,
                status: dtoIn.status,
                source: dtoIn.source,
            }));
            const updatedClientDtoOut = await this.updateClientService.exec(new update_client_dto_in_1.UpdateClientDtoIn({
                _id: currentClient._id,
                officeId: dtoIn.officeId,
                userType: dtoIn.userType,
                username: dtoIn.username,
                password: dtoIn.password,
                config: dtoIn.clientConfig,
                status: dtoIn.status,
                source: dtoIn.source,
            }));
            const updatedUserCustomerDtoOut = await this.updateUserCustomerService.exec(new update_user_customer_dto_in_1.UpdateUserCustomerDtoIn({
                _id: currentUserCustomer._id,
                twoFaRequired: dtoIn.twoFaRequired,
                twoFaActive: dtoIn.twoFaActive,
                config: dtoIn.userCustomerConfig,
                status: dtoIn.status,
                source: dtoIn.source,
            }));
            const positionSyncResult = await this.updateUserPositionIfNeeded({
                userCustomerId: currentUserCustomer._id,
                officeId: effectiveOfficeId,
                positionSlug: dtoIn.positionSlug,
                source: dtoIn.source,
            });
            return new update_user_dto_out_1.UpdateUserDtoOut(updatedProfileDtoOut.profile, updatedClientDtoOut.client, updatedUserCustomerDtoOut.userCustomer, positionSyncResult.userPositions, positionSyncResult.created, positionSyncResult.activated, positionSyncResult.inactivated);
        }
        catch (error) {
            await this.handleUseCaseExceptionService.exec(new handle_use_case_exception_dto_in_1.HandleUseCaseExceptionDtoIn({
                useCase: 'UpdateUserUseCase',
                error,
                appFile: __filename,
                context: {
                    userCustomerId: dtoIn.userCustomerId,
                    officeId: dtoIn.officeId,
                    positionSlug: dtoIn.positionSlug,
                    firstName: dtoIn.firstName,
                    lastName: dtoIn.lastName,
                    email: dtoIn.email,
                    phone: dtoIn.phone,
                    documentType: dtoIn.documentType,
                    documentValue: dtoIn.documentValue,
                    username: dtoIn.username,
                    userType: dtoIn.userType,
                    twoFaRequired: dtoIn.twoFaRequired,
                    twoFaActive: dtoIn.twoFaActive,
                    status: dtoIn.status,
                    source: dtoIn.source,
                },
            }));
            const message = error instanceof Error
                ? error.message
                : 'error on update user use case';
            throw new Error(message);
        }
    }
    async updateUserPositionIfNeeded(params) {
        const currentUserPositionsDtoOut = await this.getAllUserPositionsByUserCustomerIdService.exec(new get_all_user_positions_by_user_customer_id_dto_in_1.GetAllUserPositionsByUserCustomerIdDtoIn(params.userCustomerId));
        if (params.positionSlug === null) {
            return {
                userPositions: currentUserPositionsDtoOut.items,
                created: [],
                activated: [],
                inactivated: [],
            };
        }
        const positionDtoOut = await this.findPositionBySlugService.exec(new find_position_by_slug_dto_in_1.FindPositionBySlugDtoIn({
            officeId: params.officeId,
            slug: params.positionSlug,
        }));
        if (positionDtoOut.position.status !== 'active') {
            throw new Error('position is not active');
        }
        const targetPositionId = positionDtoOut.position._id;
        const created = [];
        const activated = [];
        const inactivated = [];
        const existingTarget = currentUserPositionsDtoOut.items.find((item) => item.positionId === targetPositionId);
        if (!existingTarget) {
            const createdDtoOut = await this.createUserPositionService.exec(new create_user_position_dto_in_1.CreateUserPositionDtoIn({
                userCustomerId: params.userCustomerId,
                positionId: targetPositionId,
                config: {
                    source: params.source,
                    positionSlug: params.positionSlug,
                },
                status: 'active',
            }));
            created.push({
                id: createdDtoOut.id,
                _id: createdDtoOut._id,
                userCustomerId: createdDtoOut.userCustomerId,
                positionId: createdDtoOut.positionId,
                config: createdDtoOut.config,
                changesHistory: createdDtoOut.changesHistory,
                status: createdDtoOut.status,
                createdAt: createdDtoOut.createdAt,
                updatedAt: createdDtoOut.updatedAt,
            });
        }
        if (existingTarget && existingTarget.status !== 'active') {
            const activatedDtoOut = await this.updateUserPositionService.exec(new update_user_position_dto_in_1.UpdateUserPositionDtoIn({
                _id: existingTarget._id,
                status: 'active',
                source: params.source,
            }));
            activated.push(activatedDtoOut.userPosition);
        }
        for (const currentUserPosition of currentUserPositionsDtoOut.items) {
            const isTarget = currentUserPosition.positionId === targetPositionId;
            if (isTarget) {
                continue;
            }
            if (currentUserPosition.status !== 'active') {
                continue;
            }
            const inactivatedDtoOut = await this.updateUserPositionService.exec(new update_user_position_dto_in_1.UpdateUserPositionDtoIn({
                _id: currentUserPosition._id,
                status: 'inactive',
                source: params.source,
            }));
            inactivated.push(inactivatedDtoOut.userPosition);
        }
        const updatedUserPositionsDtoOut = await this.getAllUserPositionsByUserCustomerIdService.exec(new get_all_user_positions_by_user_customer_id_dto_in_1.GetAllUserPositionsByUserCustomerIdDtoIn(params.userCustomerId));
        return {
            userPositions: updatedUserPositionsDtoOut.items,
            created,
            activated,
            inactivated,
        };
    }
};
exports.UpdateUserUseCase = UpdateUserUseCase;
exports.UpdateUserUseCase = UpdateUserUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [resolve_actor_authorization_service_1.ResolveActorAuthorizationService,
        find_user_customer_by_unique_id_service_1.FindUserCustomerByUniqueIdService,
        update_user_customer_service_1.UpdateUserCustomerService,
        find_client_by_unique_id_service_1.FindClientByUniqueIdService,
        update_client_service_1.UpdateClientService,
        validate_client_username_uniqueness_service_1.ValidateClientUsernameUniquenessService,
        find_profile_by_unique_id_service_1.FindProfileByUniqueIdService,
        update_profile_service_1.UpdateProfileService,
        validate_profile_email_uniqueness_service_1.ValidateProfileEmailUniquenessService,
        find_office_by_unique_id_service_1.FindOfficeByUniqueIdService,
        find_position_by_slug_service_1.FindPositionBySlugService,
        get_all_user_positions_by_user_customer_id_service_1.GetAllUserPositionsByUserCustomerIdService,
        create_user_position_service_1.CreateUserPositionService,
        update_user_position_service_1.UpdateUserPositionService,
        handle_use_case_exception_service_1.HandleUseCaseExceptionService])
], UpdateUserUseCase);
//# sourceMappingURL=update-user.use-case.js.map