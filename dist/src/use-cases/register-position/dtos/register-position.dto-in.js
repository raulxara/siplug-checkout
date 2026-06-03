"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterPositionDtoIn = void 0;
class RegisterPositionDtoIn {
    token;
    officeId;
    name;
    slug;
    description;
    config;
    status;
    constructor(params) {
        this.token = params.token ?? '';
        this.officeId = params.officeId ?? null;
        this.name = params.name ?? '';
        this.slug = params.slug ?? '';
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
    }
}
exports.RegisterPositionDtoIn = RegisterPositionDtoIn;
//# sourceMappingURL=register-position.dto-in.js.map