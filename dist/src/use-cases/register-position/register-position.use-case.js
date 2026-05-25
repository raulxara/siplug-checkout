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
exports.RegisterPositionUseCase = void 0;
const common_1 = require("@nestjs/common");
const handle_use_case_exception_dto_in_1 = require("../../common/services/use-case-support/dtos/handle-use-case-exception.dto-in");
const handle_use_case_exception_service_1 = require("../../common/services/use-case-support/handle-use-case-exception.service");
const find_office_by_unique_id_dto_in_1 = require("../../modules/offices/services/find-office-by-unique-id/dtos/find-office-by-unique-id.dto-in");
const find_office_by_unique_id_service_1 = require("../../modules/offices/services/find-office-by-unique-id/find-office-by-unique-id.service");
const create_position_dto_in_1 = require("../../modules/positions/services/create-position/dtos/create-position.dto-in");
const create_position_service_1 = require("../../modules/positions/services/create-position/create-position.service");
const validate_position_slug_uniqueness_dto_in_1 = require("../../modules/positions/services/validate-position-slug-uniqueness/dtos/validate-position-slug-uniqueness.dto-in");
const validate_position_slug_uniqueness_service_1 = require("../../modules/positions/services/validate-position-slug-uniqueness/validate-position-slug-uniqueness.service");
const resolve_actor_authorization_dto_in_1 = require("../../modules/security/services/resolve-actor-authorization/dtos/resolve-actor-authorization.dto-in");
const resolve_actor_authorization_service_1 = require("../../modules/security/services/resolve-actor-authorization/resolve-actor-authorization.service");
const register_position_dto_out_1 = require("./dtos/register-position.dto-out");
let RegisterPositionUseCase = class RegisterPositionUseCase {
    resolveActorAuthorizationService;
    findOfficeByUniqueIdService;
    validatePositionSlugUniquenessService;
    createPositionService;
    handleUseCaseExceptionService;
    constructor(resolveActorAuthorizationService, findOfficeByUniqueIdService, validatePositionSlugUniquenessService, createPositionService, handleUseCaseExceptionService) {
        this.resolveActorAuthorizationService = resolveActorAuthorizationService;
        this.findOfficeByUniqueIdService = findOfficeByUniqueIdService;
        this.validatePositionSlugUniquenessService = validatePositionSlugUniquenessService;
        this.createPositionService = createPositionService;
        this.handleUseCaseExceptionService = handleUseCaseExceptionService;
    }
    async exec(dtoIn) {
        try {
            await this.resolveActorAuthorizationService.exec(new resolve_actor_authorization_dto_in_1.ResolveActorAuthorizationDtoIn({
                token: dtoIn.token,
                requiredAction: 'registerPosition',
                requiredEntity: 'positions',
            }));
            if (dtoIn.officeId !== null) {
                await this.findOfficeByUniqueIdService.exec(new find_office_by_unique_id_dto_in_1.FindOfficeByUniqueIdDtoIn(dtoIn.officeId));
            }
            await this.validatePositionSlugUniquenessService.exec(new validate_position_slug_uniqueness_dto_in_1.ValidatePositionSlugUniquenessDtoIn({
                officeId: dtoIn.officeId,
                slug: dtoIn.slug,
            }));
            const positionDtoOut = await this.createPositionService.exec(new create_position_dto_in_1.CreatePositionDtoIn({
                officeId: dtoIn.officeId,
                name: dtoIn.name,
                slug: dtoIn.slug,
                description: dtoIn.description,
                config: dtoIn.config,
                status: dtoIn.status,
            }));
            return register_position_dto_out_1.RegisterPositionDtoOut.fromCreatePositionDtoOut(positionDtoOut);
        }
        catch (error) {
            await this.handleUseCaseExceptionService.exec(new handle_use_case_exception_dto_in_1.HandleUseCaseExceptionDtoIn({
                useCase: 'RegisterPositionUseCase',
                error,
                appFile: __filename,
                context: {
                    officeId: dtoIn.officeId,
                    name: dtoIn.name,
                    slug: dtoIn.slug,
                    description: dtoIn.description,
                    status: dtoIn.status,
                },
            }));
            const message = error instanceof Error
                ? error.message
                : 'error on register position use case';
            throw new Error(message);
        }
    }
};
exports.RegisterPositionUseCase = RegisterPositionUseCase;
exports.RegisterPositionUseCase = RegisterPositionUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [resolve_actor_authorization_service_1.ResolveActorAuthorizationService,
        find_office_by_unique_id_service_1.FindOfficeByUniqueIdService,
        validate_position_slug_uniqueness_service_1.ValidatePositionSlugUniquenessService,
        create_position_service_1.CreatePositionService,
        handle_use_case_exception_service_1.HandleUseCaseExceptionService])
], RegisterPositionUseCase);
//# sourceMappingURL=register-position.use-case.js.map