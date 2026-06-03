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
exports.RegisterPermissionController = void 0;
const common_1 = require("@nestjs/common");
const register_permission_dto_in_1 = require("./dtos/register-permission.dto-in");
const register_permission_request_1 = require("./http/register-permission.request");
const register_permission_use_case_1 = require("./register-permission.use-case");
let RegisterPermissionController = class RegisterPermissionController {
    registerPermissionUseCase;
    constructor(registerPermissionUseCase) {
        this.registerPermissionUseCase = registerPermissionUseCase;
    }
    async handle(body, authorization) {
        try {
            const token = body.token ??
                authorization?.replace(/^Bearer\s+/i, '').trim() ??
                '';
            const dtoOut = await this.registerPermissionUseCase.exec(new register_permission_dto_in_1.RegisterPermissionDtoIn({
                token,
                officeId: body.officeId ?? null,
                name: body.name,
                slug: body.slug,
                description: body.description ?? null,
                entity: body.entity,
                action: body.action,
                config: body.config ?? null,
                status: body.status ?? 'active',
            }));
            return {
                status: 'success',
                message: 'permission registered successfully',
                data: dtoOut,
            };
        }
        catch (error) {
            const message = error instanceof Error
                ? error.message
                : 'error on register permission controller';
            throw new common_1.BadRequestException({
                status: 'error',
                message,
            });
        }
    }
};
exports.RegisterPermissionController = RegisterPermissionController;
__decorate([
    (0, common_1.Post)('register'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Headers)('authorization')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [register_permission_request_1.RegisterPermissionRequest, String]),
    __metadata("design:returntype", Promise)
], RegisterPermissionController.prototype, "handle", null);
exports.RegisterPermissionController = RegisterPermissionController = __decorate([
    (0, common_1.Controller)('permissions'),
    __metadata("design:paramtypes", [register_permission_use_case_1.RegisterPermissionUseCase])
], RegisterPermissionController);
//# sourceMappingURL=register-permission.controller.js.map