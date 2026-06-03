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
exports.RegisterPositionController = void 0;
const common_1 = require("@nestjs/common");
const register_position_dto_in_1 = require("./dtos/register-position.dto-in");
const register_position_request_1 = require("./http/register-position.request");
const register_position_use_case_1 = require("./register-position.use-case");
let RegisterPositionController = class RegisterPositionController {
    registerPositionUseCase;
    constructor(registerPositionUseCase) {
        this.registerPositionUseCase = registerPositionUseCase;
    }
    async handle(body, authorization) {
        try {
            const token = body.token ??
                authorization?.replace(/^Bearer\s+/i, '').trim() ??
                '';
            const dtoOut = await this.registerPositionUseCase.exec(new register_position_dto_in_1.RegisterPositionDtoIn({
                token,
                officeId: body.officeId ?? null,
                name: body.name,
                slug: body.slug,
                description: body.description ?? null,
                config: body.config ?? null,
                status: body.status ?? 'active',
            }));
            return {
                status: 'success',
                message: 'position registered successfully',
                data: dtoOut,
            };
        }
        catch (error) {
            const message = error instanceof Error
                ? error.message
                : 'error on register position controller';
            throw new common_1.BadRequestException({
                status: 'error',
                message,
            });
        }
    }
};
exports.RegisterPositionController = RegisterPositionController;
__decorate([
    (0, common_1.Post)('register'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Headers)('authorization')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [register_position_request_1.RegisterPositionRequest, String]),
    __metadata("design:returntype", Promise)
], RegisterPositionController.prototype, "handle", null);
exports.RegisterPositionController = RegisterPositionController = __decorate([
    (0, common_1.Controller)('positions'),
    __metadata("design:paramtypes", [register_position_use_case_1.RegisterPositionUseCase])
], RegisterPositionController);
//# sourceMappingURL=register-position.controller.js.map