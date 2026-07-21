"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterGatewayDtoIn = void 0;
class RegisterGatewayDtoIn {
    token;
    name;
    slug;
    provider;
    description;
    config;
    status;
    constructor(params) {
        this.token = params.token ?? '';
        this.name = params.name ?? '';
        this.slug = params.slug ?? '';
        this.provider = params.provider ?? '';
        this.description = params.description ?? null;
        this.config = params.config ?? null;
        this.status = params.status ?? 'active';
        if (this.token.trim() === '') {
            throw new Error('token is required');
        }
        if (this.name.trim() === '') {
            throw new Error('name is required');
        }
        if (this.slug.trim() === '') {
            throw new Error('slug is required');
        }
        if (this.provider.trim() === '') {
            throw new Error('provider is required');
        }
    }
}
exports.RegisterGatewayDtoIn = RegisterGatewayDtoIn;
//# sourceMappingURL=register-gateway.dto-in.js.map