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
exports.GetAllUsersByOfficeIdUseCase = void 0;
const common_1 = require("@nestjs/common");
const handle_use_case_exception_dto_in_1 = require("../../common/services/use-case-support/dtos/handle-use-case-exception.dto-in");
const handle_use_case_exception_service_1 = require("../../common/services/use-case-support/handle-use-case-exception.service");
const get_all_clients_by_office_id_dto_in_1 = require("../../modules/clients/services/get-all-clients-by-office-id/dtos/get-all-clients-by-office-id.dto-in");
const get_all_clients_by_office_id_service_1 = require("../../modules/clients/services/get-all-clients-by-office-id/get-all-clients-by-office-id.service");
const find_office_by_unique_id_dto_in_1 = require("../../modules/offices/services/find-office-by-unique-id/dtos/find-office-by-unique-id.dto-in");
const find_office_by_unique_id_service_1 = require("../../modules/offices/services/find-office-by-unique-id/find-office-by-unique-id.service");
const get_all_positions_by_unique_ids_dto_in_1 = require("../../modules/positions/services/get-all-positions-by-unique-ids/dtos/get-all-positions-by-unique-ids.dto-in");
const get_all_positions_by_unique_ids_service_1 = require("../../modules/positions/services/get-all-positions-by-unique-ids/get-all-positions-by-unique-ids.service");
const find_profile_by_unique_id_dto_in_1 = require("../../modules/profiles/services/find-profile-by-unique-id/dtos/find-profile-by-unique-id.dto-in");
const find_profile_by_unique_id_service_1 = require("../../modules/profiles/services/find-profile-by-unique-id/find-profile-by-unique-id.service");
const resolve_actor_authorization_dto_in_1 = require("../../modules/security/services/resolve-actor-authorization/dtos/resolve-actor-authorization.dto-in");
const resolve_actor_authorization_service_1 = require("../../modules/security/services/resolve-actor-authorization/resolve-actor-authorization.service");
const get_all_user_customers_by_client_ids_dto_in_1 = require("../../modules/user-customers/services/get-all-user-customers-by-client-ids/dtos/get-all-user-customers-by-client-ids.dto-in");
const get_all_user_customers_by_client_ids_service_1 = require("../../modules/user-customers/services/get-all-user-customers-by-client-ids/get-all-user-customers-by-client-ids.service");
const get_all_user_positions_by_user_customer_id_dto_in_1 = require("../../modules/user-positions/services/get-all-user-positions-by-user-customer-id/dtos/get-all-user-positions-by-user-customer-id.dto-in");
const get_all_user_positions_by_user_customer_id_service_1 = require("../../modules/user-positions/services/get-all-user-positions-by-user-customer-id/get-all-user-positions-by-user-customer-id.service");
const get_all_users_by_office_id_dto_out_1 = require("./dtos/get-all-users-by-office-id.dto-out");
let GetAllUsersByOfficeIdUseCase = class GetAllUsersByOfficeIdUseCase {
    resolveActorAuthorizationService;
    findOfficeByUniqueIdService;
    getAllClientsByOfficeIdService;
    getAllUserCustomersByClientIdsService;
    findProfileByUniqueIdService;
    getAllUserPositionsByUserCustomerIdService;
    getAllPositionsByUniqueIdsService;
    handleUseCaseExceptionService;
    constructor(resolveActorAuthorizationService, findOfficeByUniqueIdService, getAllClientsByOfficeIdService, getAllUserCustomersByClientIdsService, findProfileByUniqueIdService, getAllUserPositionsByUserCustomerIdService, getAllPositionsByUniqueIdsService, handleUseCaseExceptionService) {
        this.resolveActorAuthorizationService = resolveActorAuthorizationService;
        this.findOfficeByUniqueIdService = findOfficeByUniqueIdService;
        this.getAllClientsByOfficeIdService = getAllClientsByOfficeIdService;
        this.getAllUserCustomersByClientIdsService = getAllUserCustomersByClientIdsService;
        this.findProfileByUniqueIdService = findProfileByUniqueIdService;
        this.getAllUserPositionsByUserCustomerIdService = getAllUserPositionsByUserCustomerIdService;
        this.getAllPositionsByUniqueIdsService = getAllPositionsByUniqueIdsService;
        this.handleUseCaseExceptionService = handleUseCaseExceptionService;
    }
    async exec(dtoIn) {
        try {
            await this.resolveActorAuthorizationService.exec(new resolve_actor_authorization_dto_in_1.ResolveActorAuthorizationDtoIn({
                token: dtoIn.token,
                requiredAction: 'getAllUsersByOfficeId',
                requiredEntity: 'user_customers',
            }));
            const officeDtoOut = await this.findOfficeByUniqueIdService.exec(new find_office_by_unique_id_dto_in_1.FindOfficeByUniqueIdDtoIn(dtoIn.officeId));
            if (officeDtoOut.office.status !== 'active') {
                throw new Error('office is not active');
            }
            const clientsDtoOut = await this.getAllClientsByOfficeIdService.exec(new get_all_clients_by_office_id_dto_in_1.GetAllClientsByOfficeIdDtoIn(dtoIn.officeId));
            if (clientsDtoOut.items.length === 0) {
                return new get_all_users_by_office_id_dto_out_1.GetAllUsersByOfficeIdDtoOut(dtoIn.officeId, [], 0, dtoIn.page, dtoIn.perPage, 0);
            }
            const clientsById = new Map(clientsDtoOut.items.map((client) => [client._id, client]));
            const clientIds = clientsDtoOut.items.map((client) => client._id);
            const userCustomersDtoOut = await this.getAllUserCustomersByClientIdsService.exec(new get_all_user_customers_by_client_ids_dto_in_1.GetAllUserCustomersByClientIdsDtoIn(clientIds));
            const items = [];
            for (const userCustomer of userCustomersDtoOut.items) {
                if (dtoIn.status !== null && userCustomer.status !== dtoIn.status) {
                    continue;
                }
                const client = clientsById.get(userCustomer.clientId);
                if (!client) {
                    continue;
                }
                const profileDtoOut = await this.findProfileByUniqueIdService.exec(new find_profile_by_unique_id_dto_in_1.FindProfileByUniqueIdDtoIn(userCustomer.profileId));
                const profile = profileDtoOut.profile;
                if (!this.matchesSearch(dtoIn.search, profile, client)) {
                    continue;
                }
                const userPositionsDtoOut = await this.getAllUserPositionsByUserCustomerIdService.exec(new get_all_user_positions_by_user_customer_id_dto_in_1.GetAllUserPositionsByUserCustomerIdDtoIn(userCustomer._id));
                const positionIds = [
                    ...new Set(userPositionsDtoOut.items.map((item) => item.positionId)),
                ];
                const positions = positionIds.length > 0
                    ? (await this.getAllPositionsByUniqueIdsService.exec(new get_all_positions_by_unique_ids_dto_in_1.GetAllPositionsByUniqueIdsDtoIn(positionIds))).items
                    : [];
                items.push({
                    profile,
                    client,
                    userCustomer: this.hideUserCustomerToken(userCustomer),
                    userPositions: userPositionsDtoOut.items,
                    positions,
                });
            }
            const total = items.length;
            const totalPages = Math.ceil(total / dtoIn.perPage);
            const start = (dtoIn.page - 1) * dtoIn.perPage;
            const paginatedItems = items.slice(start, start + dtoIn.perPage);
            return new get_all_users_by_office_id_dto_out_1.GetAllUsersByOfficeIdDtoOut(dtoIn.officeId, paginatedItems, total, dtoIn.page, dtoIn.perPage, totalPages);
        }
        catch (error) {
            await this.handleUseCaseExceptionService.exec(new handle_use_case_exception_dto_in_1.HandleUseCaseExceptionDtoIn({
                useCase: 'GetAllUsersByOfficeIdUseCase',
                error,
                appFile: __filename,
                context: {
                    officeId: dtoIn.officeId,
                    status: dtoIn.status,
                    search: dtoIn.search,
                    page: dtoIn.page,
                    perPage: dtoIn.perPage,
                },
            }));
            const message = error instanceof Error
                ? error.message
                : 'error on get all users by office id use case';
            throw new Error(message);
        }
    }
    matchesSearch(search, profile, client) {
        if (search === null || search.trim() === '') {
            return true;
        }
        const normalizedSearch = search.toLowerCase().trim();
        const searchable = [
            profile.firstName,
            profile.lastName,
            profile.email,
            profile.phone ?? '',
            client.username,
            client.userType,
        ]
            .join(' ')
            .toLowerCase();
        return searchable.includes(normalizedSearch);
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
};
exports.GetAllUsersByOfficeIdUseCase = GetAllUsersByOfficeIdUseCase;
exports.GetAllUsersByOfficeIdUseCase = GetAllUsersByOfficeIdUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [resolve_actor_authorization_service_1.ResolveActorAuthorizationService,
        find_office_by_unique_id_service_1.FindOfficeByUniqueIdService,
        get_all_clients_by_office_id_service_1.GetAllClientsByOfficeIdService,
        get_all_user_customers_by_client_ids_service_1.GetAllUserCustomersByClientIdsService,
        find_profile_by_unique_id_service_1.FindProfileByUniqueIdService,
        get_all_user_positions_by_user_customer_id_service_1.GetAllUserPositionsByUserCustomerIdService,
        get_all_positions_by_unique_ids_service_1.GetAllPositionsByUniqueIdsService,
        handle_use_case_exception_service_1.HandleUseCaseExceptionService])
], GetAllUsersByOfficeIdUseCase);
//# sourceMappingURL=get-all-users-by-office-id.use-case.js.map