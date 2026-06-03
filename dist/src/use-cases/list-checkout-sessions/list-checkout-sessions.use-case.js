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
exports.ListCheckoutSessionsUseCase = void 0;
const common_1 = require("@nestjs/common");
const handle_use_case_exception_dto_in_1 = require("../../common/services/use-case-support/dtos/handle-use-case-exception.dto-in");
const handle_use_case_exception_service_1 = require("../../common/services/use-case-support/handle-use-case-exception.service");
const get_all_checkout_session_items_by_checkout_session_id_dto_in_1 = require("../../modules/checkout-sessions/services/get-all-checkout-session-items-by-checkout-session-id/dtos/get-all-checkout-session-items-by-checkout-session-id.dto-in");
const get_all_checkout_session_items_by_checkout_session_id_service_1 = require("../../modules/checkout-sessions/services/get-all-checkout-session-items-by-checkout-session-id/get-all-checkout-session-items-by-checkout-session-id.service");
const get_all_checkout_sessions_by_office_id_dto_in_1 = require("../../modules/checkout-sessions/services/get-all-checkout-sessions-by-office-id/dtos/get-all-checkout-sessions-by-office-id.dto-in");
const get_all_checkout_sessions_by_office_id_service_1 = require("../../modules/checkout-sessions/services/get-all-checkout-sessions-by-office-id/get-all-checkout-sessions-by-office-id.service");
const find_office_by_unique_id_dto_in_1 = require("../../modules/offices/services/find-office-by-unique-id/dtos/find-office-by-unique-id.dto-in");
const find_office_by_unique_id_service_1 = require("../../modules/offices/services/find-office-by-unique-id/find-office-by-unique-id.service");
const resolve_actor_authorization_dto_in_1 = require("../../modules/security/services/resolve-actor-authorization/dtos/resolve-actor-authorization.dto-in");
const resolve_actor_authorization_service_1 = require("../../modules/security/services/resolve-actor-authorization/resolve-actor-authorization.service");
const list_checkout_sessions_dto_out_1 = require("./dtos/list-checkout-sessions.dto-out");
let ListCheckoutSessionsUseCase = class ListCheckoutSessionsUseCase {
    resolveActorAuthorizationService;
    findOfficeByUniqueIdService;
    getAllCheckoutSessionsByOfficeIdService;
    getAllCheckoutSessionItemsByCheckoutSessionIdService;
    handleUseCaseExceptionService;
    constructor(resolveActorAuthorizationService, findOfficeByUniqueIdService, getAllCheckoutSessionsByOfficeIdService, getAllCheckoutSessionItemsByCheckoutSessionIdService, handleUseCaseExceptionService) {
        this.resolveActorAuthorizationService = resolveActorAuthorizationService;
        this.findOfficeByUniqueIdService = findOfficeByUniqueIdService;
        this.getAllCheckoutSessionsByOfficeIdService = getAllCheckoutSessionsByOfficeIdService;
        this.getAllCheckoutSessionItemsByCheckoutSessionIdService = getAllCheckoutSessionItemsByCheckoutSessionIdService;
        this.handleUseCaseExceptionService = handleUseCaseExceptionService;
    }
    async exec(dtoIn) {
        try {
            await this.resolveActorAuthorizationService.exec(new resolve_actor_authorization_dto_in_1.ResolveActorAuthorizationDtoIn({
                token: dtoIn.token,
                requiredAction: 'listCheckoutSessions',
                requiredEntity: 'checkout_sessions',
            }));
            const officeDtoOut = await this.findOfficeByUniqueIdService.exec(new find_office_by_unique_id_dto_in_1.FindOfficeByUniqueIdDtoIn(dtoIn.officeId));
            if (officeDtoOut.office.status !== 'active') {
                throw new Error('office is not active');
            }
            const sessionsDtoOut = await this.getAllCheckoutSessionsByOfficeIdService.exec(new get_all_checkout_sessions_by_office_id_dto_in_1.GetAllCheckoutSessionsByOfficeIdDtoIn(dtoIn.officeId));
            const filteredSessions = sessionsDtoOut.items.filter((session) => {
                if (dtoIn.status !== null && session.status !== dtoIn.status) {
                    return false;
                }
                if (!this.matchesSearch(dtoIn.search, session)) {
                    return false;
                }
                return true;
            });
            const total = filteredSessions.length;
            const totalPages = Math.ceil(total / dtoIn.perPage);
            const start = (dtoIn.page - 1) * dtoIn.perPage;
            const paginatedSessions = filteredSessions.slice(start, start + dtoIn.perPage);
            const items = [];
            for (const checkoutSession of paginatedSessions) {
                const sessionItemsDtoOut = await this.getAllCheckoutSessionItemsByCheckoutSessionIdService.exec(new get_all_checkout_session_items_by_checkout_session_id_dto_in_1.GetAllCheckoutSessionItemsByCheckoutSessionIdDtoIn(checkoutSession._id));
                items.push({
                    checkoutSession,
                    items: sessionItemsDtoOut.items,
                });
            }
            return new list_checkout_sessions_dto_out_1.ListCheckoutSessionsDtoOut(dtoIn.officeId, items, total, dtoIn.page, dtoIn.perPage, totalPages);
        }
        catch (error) {
            await this.handleUseCaseExceptionService.exec(new handle_use_case_exception_dto_in_1.HandleUseCaseExceptionDtoIn({
                useCase: 'ListCheckoutSessionsUseCase',
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
                : 'error on list checkout sessions use case';
            throw new Error(message);
        }
    }
    matchesSearch(search, checkoutSession) {
        if (search === null || search.trim() === '') {
            return true;
        }
        const normalizedSearch = search.toLowerCase().trim();
        const searchable = [
            checkoutSession._id,
            checkoutSession.code ?? '',
            checkoutSession.externalReference ?? '',
            checkoutSession.idempotencyKey ?? '',
            checkoutSession.paymentType,
            checkoutSession.currency,
            checkoutSession.description ?? '',
            checkoutSession.status,
            checkoutSession.paymentCustomerId ?? '',
            checkoutSession.gatewayId,
            checkoutSession.apiCredentialId ?? '',
        ]
            .join(' ')
            .toLowerCase();
        return searchable.includes(normalizedSearch);
    }
};
exports.ListCheckoutSessionsUseCase = ListCheckoutSessionsUseCase;
exports.ListCheckoutSessionsUseCase = ListCheckoutSessionsUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [resolve_actor_authorization_service_1.ResolveActorAuthorizationService,
        find_office_by_unique_id_service_1.FindOfficeByUniqueIdService,
        get_all_checkout_sessions_by_office_id_service_1.GetAllCheckoutSessionsByOfficeIdService,
        get_all_checkout_session_items_by_checkout_session_id_service_1.GetAllCheckoutSessionItemsByCheckoutSessionIdService,
        handle_use_case_exception_service_1.HandleUseCaseExceptionService])
], ListCheckoutSessionsUseCase);
//# sourceMappingURL=list-checkout-sessions.use-case.js.map