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
exports.RegisterApiCredentialController = void 0;
const common_1 = require("@nestjs/common");
const register_api_credential_dto_in_1 = require("./dtos/register-api-credential.dto-in");
const register_api_credential_request_1 = require("./http/register-api-credential.request");
const register_api_credential_use_case_1 = require("./register-api-credential.use-case");
let RegisterApiCredentialController = class RegisterApiCredentialController {
    registerApiCredentialUseCase;
    constructor(registerApiCredentialUseCase) {
        this.registerApiCredentialUseCase = registerApiCredentialUseCase;
    }
    async handle(body, authorization) {
        try {
            const token = body.token ??
                authorization?.replace(/^Bearer\s+/i, '').trim() ??
                '';
            const dtoOut = await this.registerApiCredentialUseCase.exec(new register_api_credential_dto_in_1.RegisterApiCredentialDtoIn({
                token,
                officeId: body.officeId ?? null,
                clientId: body.clientId ?? null,
                gatewayId: body.gatewayId ?? null,
                name: body.name,
                slug: body.slug,
                provider: body.provider,
                providerType: body.providerType,
                environment: body.environment ?? 'local',
                providerToken: body.providerToken,
                origin: body.origin ?? null,
                config: body.config ?? null,
                expiresAt: body.expiresAt ?? null,
                status: body.status ?? 'active',
            }));
            return {
                status: 'success',
                message: 'api credential registered successfully',
                data: dtoOut,
            };
        }
        catch (error) {
            const message = error instanceof Error
                ? error.message
                : 'error on register api credential controller';
            throw new common_1.BadRequestException({
                status: 'error',
                message,
            });
        }
    }
};
exports.RegisterApiCredentialController = RegisterApiCredentialController;
__decorate([
    (0, common_1.Post)('register'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Headers)('authorization')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [register_api_credential_request_1.RegisterApiCredentialRequest, String]),
    __metadata("design:returntype", Promise)
], RegisterApiCredentialController.prototype, "handle", null);
exports.RegisterApiCredentialController = RegisterApiCredentialController = __decorate([
    (0, common_1.Controller)('api-credentials'),
    __metadata("design:paramtypes", [register_api_credential_use_case_1.RegisterApiCredentialUseCase])
], RegisterApiCredentialController);
//# sourceMappingURL=register-api-credential.controller.js.map