"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreatePermissionDtoIn = void 0;
class CreatePermissionDtoIn {
    officeId;
    name;
    slug;
    description;
    entity;
    action;
    config;
    status;
    constructor(params) {
        this.officeId = params.officeId ?? null;
        this.name = params.name;
        this.slug = params.slug;
        this.description = params.description ?? null;
        this.entity = params.entity;
        this.action = params.action;
        this.config = params.config ?? null;
        this.status = params.status ?? 'active';
        if (this.name.trim() === '') {
            throw new Error('name is required');
        }
        if (this.slug.trim() === '') {
            throw new Error('slug is required');
        }
        if (this.entity.trim() === '') {
            throw new Error('entity is required');
        }
        if (this.action.trim() === '') {
            throw new Error('action is required');
        }
    }
}
exports.CreatePermissionDtoIn = CreatePermissionDtoIn;
//# sourceMappingURL=create-permission.dto-in.js.map