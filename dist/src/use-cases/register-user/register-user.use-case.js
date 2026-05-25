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
exports.RegisterUserUseCase = void 0;
const common_1 = require("@nestjs/common");
const handle_use_case_exception_dto_in_1 = require("../../common/services/use-case-support/dtos/handle-use-case-exception.dto-in");
const handle_use_case_exception_service_1 = require("../../common/services/use-case-support/handle-use-case-exception.service");
const create_client_dto_in_1 = require("../../modules/clients/services/create-client/dtos/create-client.dto-in");
const create_client_service_1 = require("../../modules/clients/services/create-client/create-client.service");
const validate_client_username_uniqueness_dto_in_1 = require("../../modules/clients/services/validate-client-username-uniqueness/dtos/validate-client-username-uniqueness.dto-in");
const validate_client_username_uniqueness_service_1 = require("../../modules/clients/services/validate-client-username-uniqueness/validate-client-username-uniqueness.service");
const find_office_by_unique_id_dto_in_1 = require("../../modules/offices/services/find-office-by-unique-id/dtos/find-office-by-unique-id.dto-in");
const find_office_by_unique_id_service_1 = require("../../modules/offices/services/find-office-by-unique-id/find-office-by-unique-id.service");
const find_position_by_slug_dto_in_1 = require("../../modules/positions/services/find-position-by-slug/dtos/find-position-by-slug.dto-in");
const find_position_by_slug_service_1 = require("../../modules/positions/services/find-position-by-slug/find-position-by-slug.service");
const create_profile_dto_in_1 = require("../../modules/profiles/services/create-profile/dtos/create-profile.dto-in");
const create_profile_service_1 = require("../../modules/profiles/services/create-profile/create-profile.service");
const validate_profile_email_uniqueness_dto_in_1 = require("../../modules/profiles/services/validate-profile-email-uniqueness/dtos/validate-profile-email-uniqueness.dto-in");
const validate_profile_email_uniqueness_service_1 = require("../../modules/profiles/services/validate-profile-email-uniqueness/validate-profile-email-uniqueness.service");
const resolve_actor_authorization_dto_in_1 = require("../../modules/security/services/resolve-actor-authorization/dtos/resolve-actor-authorization.dto-in");
const resolve_actor_authorization_service_1 = require("../../modules/security/services/resolve-actor-authorization/resolve-actor-authorization.service");
const create_user_access_code_dto_in_1 = require("../../modules/user-access-codes/services/create-user-access-code/dtos/create-user-access-code.dto-in");
const create_user_access_code_service_1 = require("../../modules/user-access-codes/services/create-user-access-code/create-user-access-code.service");
const generate_user_access_code_service_1 = require("../../modules/user-access-codes/services/generate-user-access-code/generate-user-access-code.service");
const create_user_customer_dto_in_1 = require("../../modules/user-customers/services/create-user-customer/dtos/create-user-customer.dto-in");
const create_user_customer_service_1 = require("../../modules/user-customers/services/create-user-customer/create-user-customer.service");
const generate_user_customer_token_service_1 = require("../../modules/user-customers/services/generate-user-customer-token/generate-user-customer-token.service");
const create_user_position_dto_in_1 = require("../../modules/user-positions/services/create-user-position/dtos/create-user-position.dto-in");
const create_user_position_service_1 = require("../../modules/user-positions/services/create-user-position/create-user-position.service");
const register_user_dto_out_1 = require("./dtos/register-user.dto-out");
let RegisterUserUseCase = class RegisterUserUseCase {
    resolveActorAuthorizationService;
    findOfficeByUniqueIdService;
    findPositionBySlugService;
    validateProfileEmailUniquenessService;
    validateClientUsernameUniquenessService;
    createProfileService;
    createClientService;
    generateUserCustomerTokenService;
    createUserCustomerService;
    createUserPositionService;
    generateUserAccessCodeService;
    createUserAccessCodeService;
    handleUseCaseExceptionService;
    constructor(resolveActorAuthorizationService, findOfficeByUniqueIdService, findPositionBySlugService, validateProfileEmailUniquenessService, validateClientUsernameUniquenessService, createProfileService, createClientService, generateUserCustomerTokenService, createUserCustomerService, createUserPositionService, generateUserAccessCodeService, createUserAccessCodeService, handleUseCaseExceptionService) {
        this.resolveActorAuthorizationService = resolveActorAuthorizationService;
        this.findOfficeByUniqueIdService = findOfficeByUniqueIdService;
        this.findPositionBySlugService = findPositionBySlugService;
        this.validateProfileEmailUniquenessService = validateProfileEmailUniquenessService;
        this.validateClientUsernameUniquenessService = validateClientUsernameUniquenessService;
        this.createProfileService = createProfileService;
        this.createClientService = createClientService;
        this.generateUserCustomerTokenService = generateUserCustomerTokenService;
        this.createUserCustomerService = createUserCustomerService;
        this.createUserPositionService = createUserPositionService;
        this.generateUserAccessCodeService = generateUserAccessCodeService;
        this.createUserAccessCodeService = createUserAccessCodeService;
        this.handleUseCaseExceptionService = handleUseCaseExceptionService;
    }
    async exec(dtoIn) {
        try {
            await this.resolveActorAuthorizationService.exec(new resolve_actor_authorization_dto_in_1.ResolveActorAuthorizationDtoIn({
                token: dtoIn.token,
                requiredAction: 'registerUser',
                requiredEntity: 'user_customers',
            }));
            const officeDtoOut = await this.findOfficeByUniqueIdService.exec(new find_office_by_unique_id_dto_in_1.FindOfficeByUniqueIdDtoIn(dtoIn.officeId));
            if (officeDtoOut.office.status !== 'active') {
                throw new Error('office is not active');
            }
            const positionDtoOut = await this.findPositionBySlugService.exec(new find_position_by_slug_dto_in_1.FindPositionBySlugDtoIn({
                officeId: dtoIn.officeId,
                slug: dtoIn.positionSlug,
            }));
            if (positionDtoOut.position.status !== 'active') {
                throw new Error('position is not active');
            }
            await this.validateProfileEmailUniquenessService.exec(new validate_profile_email_uniqueness_dto_in_1.ValidateProfileEmailUniquenessDtoIn(dtoIn.email));
            await this.validateClientUsernameUniquenessService.exec(new validate_client_username_uniqueness_dto_in_1.ValidateClientUsernameUniquenessDtoIn(dtoIn.username));
            const profileDtoOut = await this.createProfileService.exec(new create_profile_dto_in_1.CreateProfileDtoIn({
                firstName: dtoIn.firstName,
                lastName: dtoIn.lastName,
                email: dtoIn.email,
                phone: dtoIn.phone,
                documentType: dtoIn.documentType,
                documentValue: dtoIn.documentValue,
                config: dtoIn.profileConfig,
                status: dtoIn.status,
            }));
            const clientDtoOut = await this.createClientService.exec(new create_client_dto_in_1.CreateClientDtoIn({
                officeId: dtoIn.officeId,
                customerId: null,
                userType: dtoIn.userType,
                username: dtoIn.username,
                password: dtoIn.password,
                config: dtoIn.clientConfig,
                status: dtoIn.status,
            }));
            const userCustomerToken = this.generateUserCustomerTokenService.exec();
            const userCustomerDtoOut = await this.createUserCustomerService.exec(new create_user_customer_dto_in_1.CreateUserCustomerDtoIn({
                clientId: clientDtoOut._id,
                profileId: profileDtoOut._id,
                token: userCustomerToken,
                twoFaRequired: dtoIn.twoFaRequired,
                twoFaActive: false,
                config: dtoIn.userCustomerConfig,
                status: dtoIn.status,
            }));
            const userPositionDtoOut = await this.createUserPositionService.exec(new create_user_position_dto_in_1.CreateUserPositionDtoIn({
                userCustomerId: userCustomerDtoOut._id,
                positionId: positionDtoOut.position._id,
                config: {
                    source: 'RegisterUserUseCase',
                    positionSlug: dtoIn.positionSlug,
                },
                status: 'active',
            }));
            const accessCodes = [];
            if (dtoIn.twoFaRequired) {
                for (const channel of dtoIn.twoFaChannels) {
                    const destination = channel === 'email' ? dtoIn.email : dtoIn.phone ?? '';
                    if (destination.trim() === '') {
                        throw new Error(`destination is required for channel ${channel}`);
                    }
                    const code = this.generateUserAccessCodeService.exec(6);
                    const expiresAt = new Date(Date.now() + 15 * 60 * 1000)
                        .toISOString()
                        .slice(0, 19)
                        .replace('T', ' ');
                    const accessCodeDtoOut = await this.createUserAccessCodeService.exec(new create_user_access_code_dto_in_1.CreateUserAccessCodeDtoIn({
                        userCustomerId: userCustomerDtoOut._id,
                        channel,
                        destination,
                        code,
                        expiresAt,
                        config: {
                            source: 'RegisterUserUseCase',
                            channel,
                        },
                        status: 'created',
                    }));
                    accessCodes.push({
                        id: accessCodeDtoOut.id,
                        _id: accessCodeDtoOut._id,
                        userCustomerId: accessCodeDtoOut.userCustomerId,
                        channel: accessCodeDtoOut.channel,
                        destination: accessCodeDtoOut.destination,
                        code: accessCodeDtoOut.code,
                        expiresAt: accessCodeDtoOut.expiresAt,
                        usedAt: accessCodeDtoOut.usedAt,
                        sentAt: accessCodeDtoOut.sentAt,
                        config: accessCodeDtoOut.config,
                        changesHistory: accessCodeDtoOut.changesHistory,
                        status: accessCodeDtoOut.status,
                        createdAt: accessCodeDtoOut.createdAt,
                        updatedAt: accessCodeDtoOut.updatedAt,
                    });
                }
            }
            return new register_user_dto_out_1.RegisterUserDtoOut({
                id: profileDtoOut.id,
                _id: profileDtoOut._id,
                firstName: profileDtoOut.firstName,
                lastName: profileDtoOut.lastName,
                email: profileDtoOut.email,
                phone: profileDtoOut.phone,
                documentType: profileDtoOut.documentType,
                documentValue: profileDtoOut.documentValue,
                addressStreet: profileDtoOut.addressStreet,
                addressNumber: profileDtoOut.addressNumber,
                addressComplement: profileDtoOut.addressComplement,
                addressNeighborhood: profileDtoOut.addressNeighborhood,
                addressCity: profileDtoOut.addressCity,
                addressState: profileDtoOut.addressState,
                addressCountry: profileDtoOut.addressCountry,
                config: profileDtoOut.config,
                changesHistory: profileDtoOut.changesHistory,
                status: profileDtoOut.status,
                createdAt: profileDtoOut.createdAt,
                updatedAt: profileDtoOut.updatedAt,
            }, {
                id: clientDtoOut.id,
                _id: clientDtoOut._id,
                officeId: clientDtoOut.officeId,
                customerId: clientDtoOut.customerId,
                userType: clientDtoOut.userType,
                username: clientDtoOut.username,
                config: clientDtoOut.config,
                changesHistory: clientDtoOut.changesHistory,
                status: clientDtoOut.status,
                createdAt: clientDtoOut.createdAt,
                updatedAt: clientDtoOut.updatedAt,
            }, {
                id: userCustomerDtoOut.id,
                _id: userCustomerDtoOut._id,
                clientId: userCustomerDtoOut.clientId,
                profileId: userCustomerDtoOut.profileId,
                token: userCustomerDtoOut.token,
                twoFaRequired: userCustomerDtoOut.twoFaRequired,
                twoFaActive: userCustomerDtoOut.twoFaActive,
                config: userCustomerDtoOut.config,
                changesHistory: userCustomerDtoOut.changesHistory,
                status: userCustomerDtoOut.status,
                createdAt: userCustomerDtoOut.createdAt,
                updatedAt: userCustomerDtoOut.updatedAt,
            }, {
                id: userPositionDtoOut.id,
                _id: userPositionDtoOut._id,
                userCustomerId: userPositionDtoOut.userCustomerId,
                positionId: userPositionDtoOut.positionId,
                config: userPositionDtoOut.config,
                changesHistory: userPositionDtoOut.changesHistory,
                status: userPositionDtoOut.status,
                createdAt: userPositionDtoOut.createdAt,
                updatedAt: userPositionDtoOut.updatedAt,
            }, accessCodes);
        }
        catch (error) {
            await this.handleUseCaseExceptionService.exec(new handle_use_case_exception_dto_in_1.HandleUseCaseExceptionDtoIn({
                useCase: 'RegisterUserUseCase',
                error,
                appFile: __filename,
                context: {
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
                    twoFaChannels: dtoIn.twoFaChannels,
                    status: dtoIn.status,
                },
            }));
            const message = error instanceof Error
                ? error.message
                : 'error on register user use case';
            throw new Error(message);
        }
    }
};
exports.RegisterUserUseCase = RegisterUserUseCase;
exports.RegisterUserUseCase = RegisterUserUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [resolve_actor_authorization_service_1.ResolveActorAuthorizationService,
        find_office_by_unique_id_service_1.FindOfficeByUniqueIdService,
        find_position_by_slug_service_1.FindPositionBySlugService,
        validate_profile_email_uniqueness_service_1.ValidateProfileEmailUniquenessService,
        validate_client_username_uniqueness_service_1.ValidateClientUsernameUniquenessService,
        create_profile_service_1.CreateProfileService,
        create_client_service_1.CreateClientService,
        generate_user_customer_token_service_1.GenerateUserCustomerTokenService,
        create_user_customer_service_1.CreateUserCustomerService,
        create_user_position_service_1.CreateUserPositionService,
        generate_user_access_code_service_1.GenerateUserAccessCodeService,
        create_user_access_code_service_1.CreateUserAccessCodeService,
        handle_use_case_exception_service_1.HandleUseCaseExceptionService])
], RegisterUserUseCase);
//# sourceMappingURL=register-user.use-case.js.map