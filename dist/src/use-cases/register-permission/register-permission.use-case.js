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
exports.RegisterPermissionUseCase = void 0;
const common_1 = require("@nestjs/common");
const handle_use_case_exception_dto_in_1 = require("../../common/services/use-case-support/dtos/handle-use-case-exception.dto-in");
const handle_use_case_exception_service_1 = require("../../common/services/use-case-support/handle-use-case-exception.service");
const create_permission_dto_in_1 = require("../../modules/permissions/services/create-permission/dtos/create-permission.dto-in");
const create_permission_service_1 = require("../../modules/permissions/services/create-permission/create-permission.service");
const validate_permission_slug_uniqueness_dto_in_1 = require("../../modules/permissions/services/validate-permission-slug-uniqueness/dtos/validate-permission-slug-uniqueness.dto-in");
const validate_permission_slug_uniqueness_service_1 = require("../../modules/permissions/services/validate-permission-slug-uniqueness/validate-permission-slug-uniqueness.service");
const resolve_actor_authorization_dto_in_1 = require("../../modules/security/services/resolve-actor-authorization/dtos/resolve-actor-authorization.dto-in");
const resolve_actor_authorization_service_1 = require("../../modules/security/services/resolve-actor-authorization/resolve-actor-authorization.service");
const register_permission_dto_out_1 = require("./dtos/register-permission.dto-out");
let RegisterPermissionUseCase = class RegisterPermissionUseCase {
    resolveActorAuthorizationService;
    validatePermissionSlugUniquenessService;
    createPermissionService;
    handleUseCaseExceptionService;
    constructor(resolveActorAuthorizationService, validatePermissionSlugUniquenessService, createPermissionService, handleUseCaseExceptionService) {
        this.resolveActorAuthorizationService = resolveActorAuthorizationService;
        this.validatePermissionSlugUniquenessService = validatePermissionSlugUniquenessService;
        this.createPermissionService = createPermissionService;
        this.handleUseCaseExceptionService = handleUseCaseExceptionService;
    }
    async exec(dtoIn) {
        try {
            await this.resolveActorAuthorizationService.exec(new resolve_actor_authorization_dto_in_1.ResolveActorAuthorizationDtoIn({
                token: dtoIn.token,
                requiredAction: 'registerPermission',
                requiredEntity: 'permissions',
            }));
            await this.validatePermissionSlugUniquenessService.exec(new validate_permission_slug_uniqueness_dto_in_1.ValidatePermissionSlugUniquenessDtoIn({
                officeId: dtoIn.officeId,
                slug: dtoIn.slug,
            }));
            const permissionDtoOut = await this.createPermissionService.exec(new create_permission_dto_in_1.CreatePermissionDtoIn({
                officeId: dtoIn.officeId,
                name: dtoIn.name,
                slug: dtoIn.slug,
                description: dtoIn.description,
                entity: dtoIn.entity,
                action: dtoIn.action,
                config: dtoIn.config,
                status: dtoIn.status,
            }));
            return register_permission_dto_out_1.RegisterPermissionDtoOut.fromCreatePermissionDtoOut(permissionDtoOut);
        }
        catch (error) {
            await this.handleUseCaseExceptionService.exec(new handle_use_case_exception_dto_in_1.HandleUseCaseExceptionDtoIn({
                useCase: 'RegisterPermissionUseCase',
                error,
                appFile: __filename,
                context: {
                    officeId: dtoIn.officeId,
                    name: dtoIn.name,
                    slug: dtoIn.slug,
                    entity: dtoIn.entity,
                    action: dtoIn.action,
                    status: dtoIn.status,
                },
            }));
            const message = error instanceof Error
                ? error.message
                : 'error on register permission use case';
            throw new Error(message);
        }
    }
};
exports.RegisterPermissionUseCase = RegisterPermissionUseCase;
exports.RegisterPermissionUseCase = RegisterPermissionUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [resolve_actor_authorization_service_1.ResolveActorAuthorizationService,
        validate_permission_slug_uniqueness_service_1.ValidatePermissionSlugUniquenessService,
        create_permission_service_1.CreatePermissionService,
        handle_use_case_exception_service_1.HandleUseCaseExceptionService])
], RegisterPermissionUseCase);
//# sourceMappingURL=register-permission.use-case.js.map