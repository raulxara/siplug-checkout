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
exports.UpdateGatewayUseCase = void 0;
const common_1 = require("@nestjs/common");
const handle_use_case_exception_dto_in_1 = require("../../common/services/use-case-support/dtos/handle-use-case-exception.dto-in");
const handle_use_case_exception_service_1 = require("../../common/services/use-case-support/handle-use-case-exception.service");
const find_gateway_by_unique_id_dto_in_1 = require("../../modules/gateways/services/find-gateway-by-unique-id/dtos/find-gateway-by-unique-id.dto-in");
const find_gateway_by_unique_id_service_1 = require("../../modules/gateways/services/find-gateway-by-unique-id/find-gateway-by-unique-id.service");
const update_gateway_dto_in_1 = require("../../modules/gateways/services/update-gateway/dtos/update-gateway.dto-in");
const update_gateway_service_1 = require("../../modules/gateways/services/update-gateway/update-gateway.service");
const validate_gateway_slug_uniqueness_dto_in_1 = require("../../modules/gateways/services/validate-gateway-slug-uniqueness/dtos/validate-gateway-slug-uniqueness.dto-in");
const validate_gateway_slug_uniqueness_service_1 = require("../../modules/gateways/services/validate-gateway-slug-uniqueness/validate-gateway-slug-uniqueness.service");
const resolve_actor_authorization_dto_in_1 = require("../../modules/security/services/resolve-actor-authorization/dtos/resolve-actor-authorization.dto-in");
const resolve_actor_authorization_service_1 = require("../../modules/security/services/resolve-actor-authorization/resolve-actor-authorization.service");
const update_gateway_dto_out_1 = require("./dtos/update-gateway.dto-out");
let UpdateGatewayUseCase = class UpdateGatewayUseCase {
    resolveActorAuthorizationService;
    findGatewayByUniqueIdService;
    validateGatewaySlugUniquenessService;
    updateGatewayService;
    handleUseCaseExceptionService;
    constructor(resolveActorAuthorizationService, findGatewayByUniqueIdService, validateGatewaySlugUniquenessService, updateGatewayService, handleUseCaseExceptionService) {
        this.resolveActorAuthorizationService = resolveActorAuthorizationService;
        this.findGatewayByUniqueIdService = findGatewayByUniqueIdService;
        this.validateGatewaySlugUniquenessService = validateGatewaySlugUniquenessService;
        this.updateGatewayService = updateGatewayService;
        this.handleUseCaseExceptionService = handleUseCaseExceptionService;
    }
    async exec(dtoIn) {
        try {
            await this.resolveActorAuthorizationService.exec(new resolve_actor_authorization_dto_in_1.ResolveActorAuthorizationDtoIn({
                token: dtoIn.token,
                requiredAction: 'updateGateway',
                requiredEntity: 'gateways',
            }));
            const currentGatewayDtoOut = await this.findGatewayByUniqueIdService.exec(new find_gateway_by_unique_id_dto_in_1.FindGatewayByUniqueIdDtoIn(dtoIn.gatewayId));
            const currentGateway = currentGatewayDtoOut.gateway;
            if (dtoIn.slug !== null && dtoIn.slug !== currentGateway.slug) {
                await this.validateGatewaySlugUniquenessService.exec(new validate_gateway_slug_uniqueness_dto_in_1.ValidateGatewaySlugUniquenessDtoIn(dtoIn.slug));
            }
            const updatedGatewayDtoOut = await this.updateGatewayService.exec(new update_gateway_dto_in_1.UpdateGatewayDtoIn({
                _id: dtoIn.gatewayId,
                name: dtoIn.name,
                slug: dtoIn.slug,
                provider: dtoIn.provider,
                description: dtoIn.description,
                config: dtoIn.config,
                status: dtoIn.status,
                source: dtoIn.source,
            }));
            return new update_gateway_dto_out_1.UpdateGatewayDtoOut(updatedGatewayDtoOut.gateway);
        }
        catch (error) {
            await this.handleUseCaseExceptionService.exec(new handle_use_case_exception_dto_in_1.HandleUseCaseExceptionDtoIn({
                useCase: 'UpdateGatewayUseCase',
                error,
                appFile: __filename,
                context: {
                    gatewayId: dtoIn.gatewayId,
                    name: dtoIn.name,
                    slug: dtoIn.slug,
                    provider: dtoIn.provider,
                    description: dtoIn.description,
                    status: dtoIn.status,
                    source: dtoIn.source,
                },
            }));
            const message = error instanceof Error
                ? error.message
                : 'error on update gateway use case';
            throw new Error(message);
        }
    }
};
exports.UpdateGatewayUseCase = UpdateGatewayUseCase;
exports.UpdateGatewayUseCase = UpdateGatewayUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [resolve_actor_authorization_service_1.ResolveActorAuthorizationService,
        find_gateway_by_unique_id_service_1.FindGatewayByUniqueIdService,
        validate_gateway_slug_uniqueness_service_1.ValidateGatewaySlugUniquenessService,
        update_gateway_service_1.UpdateGatewayService,
        handle_use_case_exception_service_1.HandleUseCaseExceptionService])
], UpdateGatewayUseCase);
//# sourceMappingURL=update-gateway.use-case.js.map