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
exports.GetUserUseCase = void 0;
const common_1 = require("@nestjs/common");
const handle_use_case_exception_dto_in_1 = require("../../common/services/use-case-support/dtos/handle-use-case-exception.dto-in");
const handle_use_case_exception_service_1 = require("../../common/services/use-case-support/handle-use-case-exception.service");
const find_client_by_unique_id_dto_in_1 = require("../../modules/clients/services/find-client-by-unique-id/dtos/find-client-by-unique-id.dto-in");
const find_client_by_unique_id_service_1 = require("../../modules/clients/services/find-client-by-unique-id/find-client-by-unique-id.service");
const get_all_positions_by_unique_ids_dto_in_1 = require("../../modules/positions/services/get-all-positions-by-unique-ids/dtos/get-all-positions-by-unique-ids.dto-in");
const get_all_positions_by_unique_ids_service_1 = require("../../modules/positions/services/get-all-positions-by-unique-ids/get-all-positions-by-unique-ids.service");
const find_profile_by_unique_id_dto_in_1 = require("../../modules/profiles/services/find-profile-by-unique-id/dtos/find-profile-by-unique-id.dto-in");
const find_profile_by_unique_id_service_1 = require("../../modules/profiles/services/find-profile-by-unique-id/find-profile-by-unique-id.service");
const resolve_actor_authorization_dto_in_1 = require("../../modules/security/services/resolve-actor-authorization/dtos/resolve-actor-authorization.dto-in");
const resolve_actor_authorization_service_1 = require("../../modules/security/services/resolve-actor-authorization/resolve-actor-authorization.service");
const get_all_user_access_codes_by_user_customer_id_dto_in_1 = require("../../modules/user-access-codes/services/get-all-user-access-codes-by-user-customer-id/dtos/get-all-user-access-codes-by-user-customer-id.dto-in");
const get_all_user_access_codes_by_user_customer_id_service_1 = require("../../modules/user-access-codes/services/get-all-user-access-codes-by-user-customer-id/get-all-user-access-codes-by-user-customer-id.service");
const find_user_customer_by_unique_id_dto_in_1 = require("../../modules/user-customers/services/find-user-customer-by-unique-id/dtos/find-user-customer-by-unique-id.dto-in");
const find_user_customer_by_unique_id_service_1 = require("../../modules/user-customers/services/find-user-customer-by-unique-id/find-user-customer-by-unique-id.service");
const get_all_user_positions_by_user_customer_id_dto_in_1 = require("../../modules/user-positions/services/get-all-user-positions-by-user-customer-id/dtos/get-all-user-positions-by-user-customer-id.dto-in");
const get_all_user_positions_by_user_customer_id_service_1 = require("../../modules/user-positions/services/get-all-user-positions-by-user-customer-id/get-all-user-positions-by-user-customer-id.service");
const get_user_dto_out_1 = require("./dtos/get-user.dto-out");
let GetUserUseCase = class GetUserUseCase {
    resolveActorAuthorizationService;
    findUserCustomerByUniqueIdService;
    findClientByUniqueIdService;
    findProfileByUniqueIdService;
    getAllUserPositionsByUserCustomerIdService;
    getAllPositionsByUniqueIdsService;
    getAllUserAccessCodesByUserCustomerIdService;
    handleUseCaseExceptionService;
    constructor(resolveActorAuthorizationService, findUserCustomerByUniqueIdService, findClientByUniqueIdService, findProfileByUniqueIdService, getAllUserPositionsByUserCustomerIdService, getAllPositionsByUniqueIdsService, getAllUserAccessCodesByUserCustomerIdService, handleUseCaseExceptionService) {
        this.resolveActorAuthorizationService = resolveActorAuthorizationService;
        this.findUserCustomerByUniqueIdService = findUserCustomerByUniqueIdService;
        this.findClientByUniqueIdService = findClientByUniqueIdService;
        this.findProfileByUniqueIdService = findProfileByUniqueIdService;
        this.getAllUserPositionsByUserCustomerIdService = getAllUserPositionsByUserCustomerIdService;
        this.getAllPositionsByUniqueIdsService = getAllPositionsByUniqueIdsService;
        this.getAllUserAccessCodesByUserCustomerIdService = getAllUserAccessCodesByUserCustomerIdService;
        this.handleUseCaseExceptionService = handleUseCaseExceptionService;
    }
    async exec(dtoIn) {
        try {
            await this.resolveActorAuthorizationService.exec(new resolve_actor_authorization_dto_in_1.ResolveActorAuthorizationDtoIn({
                token: dtoIn.token,
                requiredAction: 'getUser',
                requiredEntity: 'user_customers',
            }));
            const userCustomerDtoOut = await this.findUserCustomerByUniqueIdService.exec(new find_user_customer_by_unique_id_dto_in_1.FindUserCustomerByUniqueIdDtoIn(dtoIn.userCustomerId));
            const userCustomer = userCustomerDtoOut.userCustomer;
            const clientDtoOut = await this.findClientByUniqueIdService.exec(new find_client_by_unique_id_dto_in_1.FindClientByUniqueIdDtoIn(userCustomer.clientId));
            const profileDtoOut = await this.findProfileByUniqueIdService.exec(new find_profile_by_unique_id_dto_in_1.FindProfileByUniqueIdDtoIn(userCustomer.profileId));
            const userPositionsDtoOut = await this.getAllUserPositionsByUserCustomerIdService.exec(new get_all_user_positions_by_user_customer_id_dto_in_1.GetAllUserPositionsByUserCustomerIdDtoIn(userCustomer._id));
            const positionIds = [
                ...new Set(userPositionsDtoOut.items.map((item) => item.positionId)),
            ];
            const positions = positionIds.length > 0
                ? (await this.getAllPositionsByUniqueIdsService.exec(new get_all_positions_by_unique_ids_dto_in_1.GetAllPositionsByUniqueIdsDtoIn(positionIds))).items
                : [];
            const accessCodesDtoOut = await this.getAllUserAccessCodesByUserCustomerIdService.exec(new get_all_user_access_codes_by_user_customer_id_dto_in_1.GetAllUserAccessCodesByUserCustomerIdDtoIn(userCustomer._id));
            return new get_user_dto_out_1.GetUserDtoOut(profileDtoOut.profile, clientDtoOut.client, this.hideUserCustomerToken(userCustomer), userPositionsDtoOut.items, positions, accessCodesDtoOut.items.map((item) => this.hideAccessCode(item)));
        }
        catch (error) {
            await this.handleUseCaseExceptionService.exec(new handle_use_case_exception_dto_in_1.HandleUseCaseExceptionDtoIn({
                useCase: 'GetUserUseCase',
                error,
                appFile: __filename,
                context: {
                    userCustomerId: dtoIn.userCustomerId,
                },
            }));
            const message = error instanceof Error ? error.message : 'error on get user use case';
            throw new Error(message);
        }
    }
    hideUserCustomerToken(userCustomer) {
        return {
            id: userCustomer.id,
            _id: userCustomer._id,
            clientId: userCustomer.clientId,
            profileId: userCustomer.profileId,
            twoFaRequired: userCustomer.twoFaRequired,
            twoFaActive: userCustomer.twoFaActive,
            config: userCustomer.config,
            changesHistory: userCustomer.changesHistory,
            status: userCustomer.status,
            createdAt: userCustomer.createdAt,
            updatedAt: userCustomer.updatedAt,
        };
    }
    hideAccessCode(accessCode) {
        return {
            id: accessCode.id,
            _id: accessCode._id,
            userCustomerId: accessCode.userCustomerId,
            channel: accessCode.channel,
            destination: accessCode.destination,
            expiresAt: accessCode.expiresAt,
            usedAt: accessCode.usedAt,
            sentAt: accessCode.sentAt,
            config: accessCode.config,
            changesHistory: accessCode.changesHistory,
            status: accessCode.status,
            createdAt: accessCode.createdAt,
            updatedAt: accessCode.updatedAt,
            codeHidden: true,
        };
    }
};
exports.GetUserUseCase = GetUserUseCase;
exports.GetUserUseCase = GetUserUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [resolve_actor_authorization_service_1.ResolveActorAuthorizationService,
        find_user_customer_by_unique_id_service_1.FindUserCustomerByUniqueIdService,
        find_client_by_unique_id_service_1.FindClientByUniqueIdService,
        find_profile_by_unique_id_service_1.FindProfileByUniqueIdService,
        get_all_user_positions_by_user_customer_id_service_1.GetAllUserPositionsByUserCustomerIdService,
        get_all_positions_by_unique_ids_service_1.GetAllPositionsByUniqueIdsService,
        get_all_user_access_codes_by_user_customer_id_service_1.GetAllUserAccessCodesByUserCustomerIdService,
        handle_use_case_exception_service_1.HandleUseCaseExceptionService])
], GetUserUseCase);
//# sourceMappingURL=get-user.use-case.js.map