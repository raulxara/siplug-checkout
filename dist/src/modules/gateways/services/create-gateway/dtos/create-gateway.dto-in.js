"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateGatewayDtoIn = void 0;
class CreateGatewayDtoIn {
    name;
    slug;
    provider;
    description;
    config;
    status;
    constructor(params) {
        this.name = params.name;
        this.slug = params.slug;
        this.provider = params.provider;
        this.description = params.description ?? null;
        this.config = params.config ?? null;
        this.status = params.status ?? 'active';
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
exports.CreateGatewayDtoIn = CreateGatewayDtoIn;
//# sourceMappingURL=create-gateway.dto-in.js.map