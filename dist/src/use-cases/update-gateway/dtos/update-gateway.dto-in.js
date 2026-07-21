"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateGatewayDtoIn = void 0;
class UpdateGatewayDtoIn {
    token;
    gatewayId;
    name;
    slug;
    provider;
    description;
    config;
    status;
    source;
    constructor(params) {
        this.token = params.token ?? '';
        this.gatewayId = params.gatewayId ?? '';
        this.name = params.name ?? null;
        this.slug = params.slug ?? null;
        this.provider = params.provider ?? null;
        this.description = params.description ?? null;
        this.config = params.config ?? null;
        this.status = params.status ?? null;
        this.source = params.source ?? 'UpdateGatewayUseCase';
        if (this.token.trim() === '') {
            throw new Error('token is required');
        }
        if (this.gatewayId.trim() === '') {
            throw new Error('gatewayId is required');
        }
    }
}
exports.UpdateGatewayDtoIn = UpdateGatewayDtoIn;
//# sourceMappingURL=update-gateway.dto-in.js.map