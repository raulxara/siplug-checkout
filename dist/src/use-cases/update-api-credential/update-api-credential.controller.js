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
exports.UpdateApiCredentialController = void 0;
const common_1 = require("@nestjs/common");
const update_api_credential_dto_in_1 = require("./dtos/update-api-credential.dto-in");
const update_api_credential_request_1 = require("./http/update-api-credential.request");
const update_api_credential_use_case_1 = require("./update-api-credential.use-case");
let UpdateApiCredentialController = class UpdateApiCredentialController {
    updateApiCredentialUseCase;
    constructor(updateApiCredentialUseCase) {
        this.updateApiCredentialUseCase = updateApiCredentialUseCase;
    }
    async handle(body, authorization) {
        try {
            const token = body.token ??
                authorization?.replace(/^Bearer\s+/i, '').trim() ??
                '';
            const dtoOut = await this.updateApiCredentialUseCase.exec(new update_api_credential_dto_in_1.UpdateApiCredentialDtoIn({
                token,
                apiCredentialId: body.apiCredentialId,
                officeId: body.officeId ?? null,
                clientId: body.clientId ?? null,
                gatewayId: body.gatewayId ?? null,
                name: body.name ?? null,
                slug: body.slug ?? null,
                provider: body.provider ?? null,
                providerType: body.providerType ?? null,
                environment: body.environment ?? null,
                providerToken: body.providerToken ?? null,
                origin: body.origin ?? null,
                config: body.config ?? null,
                expiresAt: body.expiresAt ?? null,
                status: body.status ?? null,
                source: body.source ?? 'UpdateApiCredentialController',
            }));
            return {
                status: 'success',
                message: 'api credential updated successfully',
                data: dtoOut,
            };
        }
        catch (error) {
            const message = error instanceof Error
                ? error.message
                : 'error on update api credential controller';
            throw new common_1.BadRequestException({
                status: 'error',
                message,
            });
        }
    }
};
exports.UpdateApiCredentialController = UpdateApiCredentialController;
__decorate([
    (0, common_1.Put)('update'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Headers)('authorization')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_api_credential_request_1.UpdateApiCredentialRequest, String]),
    __metadata("design:returntype", Promise)
], UpdateApiCredentialController.prototype, "handle", null);
exports.UpdateApiCredentialController = UpdateApiCredentialController = __decorate([
    (0, common_1.Controller)('api-credentials'),
    __metadata("design:paramtypes", [update_api_credential_use_case_1.UpdateApiCredentialUseCase])
], UpdateApiCredentialController);
//# sourceMappingURL=update-api-credential.controller.js.map