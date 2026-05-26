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
exports.UpdateGatewayController = void 0;
const common_1 = require("@nestjs/common");
const update_gateway_dto_in_1 = require("./dtos/update-gateway.dto-in");
const update_gateway_request_1 = require("./http/update-gateway.request");
const update_gateway_use_case_1 = require("./update-gateway.use-case");
let UpdateGatewayController = class UpdateGatewayController {
    updateGatewayUseCase;
    constructor(updateGatewayUseCase) {
        this.updateGatewayUseCase = updateGatewayUseCase;
    }
    async handle(body, authorization) {
        try {
            const token = body.token ??
                authorization?.replace(/^Bearer\s+/i, '').trim() ??
                '';
            const dtoOut = await this.updateGatewayUseCase.exec(new update_gateway_dto_in_1.UpdateGatewayDtoIn({
                token,
                gatewayId: body.gatewayId,
                name: body.name ?? null,
                slug: body.slug ?? null,
                provider: body.provider ?? null,
                description: body.description ?? null,
                config: body.config ?? null,
                status: body.status ?? null,
                source: body.source ?? 'UpdateGatewayController',
            }));
            return {
                status: 'success',
                message: 'gateway updated successfully',
                data: dtoOut,
            };
        }
        catch (error) {
            const message = error instanceof Error
                ? error.message
                : 'error on update gateway controller';
            throw new common_1.BadRequestException({
                status: 'error',
                message,
            });
        }
    }
};
exports.UpdateGatewayController = UpdateGatewayController;
__decorate([
    (0, common_1.Put)('update'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Headers)('authorization')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_gateway_request_1.UpdateGatewayRequest, String]),
    __metadata("design:returntype", Promise)
], UpdateGatewayController.prototype, "handle", null);
exports.UpdateGatewayController = UpdateGatewayController = __decorate([
    (0, common_1.Controller)('gateways'),
    __metadata("design:paramtypes", [update_gateway_use_case_1.UpdateGatewayUseCase])
], UpdateGatewayController);
//# sourceMappingURL=update-gateway.controller.js.map