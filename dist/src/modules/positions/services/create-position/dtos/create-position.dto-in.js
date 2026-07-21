"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreatePositionDtoIn = void 0;
class CreatePositionDtoIn {
    officeId;
    name;
    slug;
    description;
    config;
    status;
    constructor(params) {
        this.officeId = params.officeId ?? null;
        this.name = params.name;
        this.slug = params.slug;
        this.description = params.description ?? null;
        this.config = params.config ?? null;
        this.status = params.status ?? 'active';
        if (this.name.trim() === '') {
            throw new Error('name is required');
        }
        if (this.slug.trim() === '') {
            throw new Error('slug is required');
        }
    }
}
exports.CreatePositionDtoIn = CreatePositionDtoIn;
//# sourceMappingURL=create-position.dto-in.js.map