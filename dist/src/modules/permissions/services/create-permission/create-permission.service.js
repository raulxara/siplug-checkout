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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreatePermissionService = void 0;
const common_1 = require("@nestjs/common");
const permission_entity_1 = require("../../entities/permission.entity");
const permissions_tokens_1 = require("../../tokens/permissions.tokens");
const create_permission_dto_out_1 = require("./dtos/create-permission.dto-out");
let CreatePermissionService = class CreatePermissionService {
    repository;
    constructor(repository) {
        this.repository = repository;
    }
    async exec(dtoIn) {
        try {
            const entity = new permission_entity_1.PermissionEntity(this.repository);
            entity.officeId = dtoIn.officeId;
            entity.name = dtoIn.name;
            entity.slug = dtoIn.slug;
            entity.description = dtoIn.description;
            entity.entity = dtoIn.entity;
            entity.action = dtoIn.action;
            entity.config = dtoIn.config;
            entity.status = dtoIn.status;
            await entity.create();
            return create_permission_dto_out_1.CreatePermissionDtoOut.fromEntity(entity);
        }
        catch (error) {
            const message = error instanceof Error ? error.message : 'error on create permission';
            throw new Error(message);
        }
    }
};
exports.CreatePermissionService = CreatePermissionService;
exports.CreatePermissionService = CreatePermissionService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(permissions_tokens_1.PERMISSIONS_REPOSITORY)),
    __metadata("design:paramtypes", [Object])
], CreatePermissionService);
//# sourceMappingURL=create-permission.service.js.map