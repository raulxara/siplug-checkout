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
exports.RegisterGatewayUseCase = void 0;
const common_1 = require("@nestjs/common");
const handle_use_case_exception_dto_in_1 = require("../../common/services/use-case-support/dtos/handle-use-case-exception.dto-in");
const handle_use_case_exception_service_1 = require("../../common/services/use-case-support/handle-use-case-exception.service");
const create_gateway_dto_in_1 = require("../../modules/gateways/services/create-gateway/dtos/create-gateway.dto-in");
const create_gateway_service_1 = require("../../modules/gateways/services/create-gateway/create-gateway.service");
const validate_gateway_slug_uniqueness_dto_in_1 = require("../../modules/gateways/services/validate-gateway-slug-uniqueness/dtos/validate-gateway-slug-uniqueness.dto-in");
const validate_gateway_slug_uniqueness_service_1 = require("../../modules/gateways/services/validate-gateway-slug-uniqueness/validate-gateway-slug-uniqueness.service");
const resolve_actor_authorization_dto_in_1 = require("../../modules/security/services/resolve-actor-authorization/dtos/resolve-actor-authorization.dto-in");
const resolve_actor_authorization_service_1 = require("../../modules/security/services/resolve-actor-authorization/resolve-actor-authorization.service");
const register_gateway_dto_out_1 = require("./dtos/register-gateway.dto-out");
let RegisterGatewayUseCase = class RegisterGatewayUseCase {
    resolveActorAuthorizationService;
    validateGatewaySlugUniquenessService;
    createGatewayService;
    handleUseCaseExceptionService;
    constructor(resolveActorAuthorizationService, validateGatewaySlugUniquenessService, createGatewayService, handleUseCaseExceptionService) {
        this.resolveActorAuthorizationService = resolveActorAuthorizationService;
        this.validateGatewaySlugUniquenessService = validateGatewaySlugUniquenessService;
        this.createGatewayService = createGatewayService;
        this.handleUseCaseExceptionService = handleUseCaseExceptionService;
    }
    async exec(dtoIn) {
        try {
            await this.resolveActorAuthorizationService.exec(new resolve_actor_authorization_dto_in_1.ResolveActorAuthorizationDtoIn({
                token: dtoIn.token,
                requiredAction: 'registerGateway',
                requiredEntity: 'gateways',
            }));
            await this.validateGatewaySlugUniquenessService.exec(new validate_gateway_slug_uniqueness_dto_in_1.ValidateGatewaySlugUniquenessDtoIn(dtoIn.slug));
            const gatewayDtoOut = await this.createGatewayService.exec(new create_gateway_dto_in_1.CreateGatewayDtoIn({
                name: dtoIn.name,
                slug: dtoIn.slug,
                provider: dtoIn.provider,
                description: dtoIn.description,
                config: dtoIn.config,
                status: dtoIn.status,
            }));
            return register_gateway_dto_out_1.RegisterGatewayDtoOut.fromCreateGatewayDtoOut(gatewayDtoOut);
        }
        catch (error) {
            await this.handleUseCaseExceptionService.exec(new handle_use_case_exception_dto_in_1.HandleUseCaseExceptionDtoIn({
                useCase: 'RegisterGatewayUseCase',
                error,
                appFile: __filename,
                context: {
                    name: dtoIn.name,
                    slug: dtoIn.slug,
                    provider: dtoIn.provider,
                    description: dtoIn.description,
                    status: dtoIn.status,
                },
            }));
            const message = error instanceof Error
                ? error.message
                : 'error on register gateway use case';
            throw new Error(message);
        }
    }
};
exports.RegisterGatewayUseCase = RegisterGatewayUseCase;
exports.RegisterGatewayUseCase = RegisterGatewayUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [resolve_actor_authorization_service_1.ResolveActorAuthorizationService,
        validate_gateway_slug_uniqueness_service_1.ValidateGatewaySlugUniquenessService,
        create_gateway_service_1.CreateGatewayService,
        handle_use_case_exception_service_1.HandleUseCaseExceptionService])
], RegisterGatewayUseCase);
//# sourceMappingURL=register-gateway.use-case.js.map