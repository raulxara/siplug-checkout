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
exports.GetAllGatewaysUseCase = void 0;
const common_1 = require("@nestjs/common");
const handle_use_case_exception_dto_in_1 = require("../../common/services/use-case-support/dtos/handle-use-case-exception.dto-in");
const handle_use_case_exception_service_1 = require("../../common/services/use-case-support/handle-use-case-exception.service");
const get_all_gateways_dto_in_1 = require("../../modules/gateways/services/get-all-gateways/dtos/get-all-gateways.dto-in");
const get_all_gateways_service_1 = require("../../modules/gateways/services/get-all-gateways/get-all-gateways.service");
const resolve_actor_authorization_dto_in_1 = require("../../modules/security/services/resolve-actor-authorization/dtos/resolve-actor-authorization.dto-in");
const resolve_actor_authorization_service_1 = require("../../modules/security/services/resolve-actor-authorization/resolve-actor-authorization.service");
const get_all_gateways_dto_out_1 = require("./dtos/get-all-gateways.dto-out");
let GetAllGatewaysUseCase = class GetAllGatewaysUseCase {
    resolveActorAuthorizationService;
    getAllGatewaysService;
    handleUseCaseExceptionService;
    constructor(resolveActorAuthorizationService, getAllGatewaysService, handleUseCaseExceptionService) {
        this.resolveActorAuthorizationService = resolveActorAuthorizationService;
        this.getAllGatewaysService = getAllGatewaysService;
        this.handleUseCaseExceptionService = handleUseCaseExceptionService;
    }
    async exec(dtoIn) {
        try {
            await this.resolveActorAuthorizationService.exec(new resolve_actor_authorization_dto_in_1.ResolveActorAuthorizationDtoIn({
                token: dtoIn.token,
                requiredAction: 'getAllGateways',
                requiredEntity: 'gateways',
            }));
            const gatewaysDtoOut = await this.getAllGatewaysService.exec(new get_all_gateways_dto_in_1.GetAllGatewaysDtoIn());
            const filteredItems = gatewaysDtoOut.items.filter((gateway) => {
                if (dtoIn.status !== null && gateway.status !== dtoIn.status) {
                    return false;
                }
                if (!this.matchesSearch(dtoIn.search, gateway)) {
                    return false;
                }
                return true;
            });
            const total = filteredItems.length;
            const totalPages = Math.ceil(total / dtoIn.perPage);
            const start = (dtoIn.page - 1) * dtoIn.perPage;
            const paginatedItems = filteredItems.slice(start, start + dtoIn.perPage);
            return new get_all_gateways_dto_out_1.GetAllGatewaysDtoOut(paginatedItems, total, dtoIn.page, dtoIn.perPage, totalPages);
        }
        catch (error) {
            await this.handleUseCaseExceptionService.exec(new handle_use_case_exception_dto_in_1.HandleUseCaseExceptionDtoIn({
                useCase: 'GetAllGatewaysUseCase',
                error,
                appFile: __filename,
                context: {
                    status: dtoIn.status,
                    search: dtoIn.search,
                    page: dtoIn.page,
                    perPage: dtoIn.perPage,
                },
            }));
            const message = error instanceof Error
                ? error.message
                : 'error on get all gateways use case';
            throw new Error(message);
        }
    }
    matchesSearch(search, gateway) {
        if (search === null || search.trim() === '') {
            return true;
        }
        const normalizedSearch = search.toLowerCase().trim();
        const searchable = [
            gateway.name,
            gateway.slug,
            gateway.provider,
            gateway.description ?? '',
            gateway.status,
        ]
            .join(' ')
            .toLowerCase();
        return searchable.includes(normalizedSearch);
    }
};
exports.GetAllGatewaysUseCase = GetAllGatewaysUseCase;
exports.GetAllGatewaysUseCase = GetAllGatewaysUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [resolve_actor_authorization_service_1.ResolveActorAuthorizationService,
        get_all_gateways_service_1.GetAllGatewaysService,
        handle_use_case_exception_service_1.HandleUseCaseExceptionService])
], GetAllGatewaysUseCase);
//# sourceMappingURL=get-all-gateways.use-case.js.map