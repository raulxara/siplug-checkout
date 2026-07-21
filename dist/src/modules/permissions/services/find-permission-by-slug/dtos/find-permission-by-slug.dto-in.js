"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FindPermissionBySlugDtoIn = void 0;
class FindPermissionBySlugDtoIn {
    officeId;
    slug;
    constructor(params) {
        this.officeId = params.officeId ?? null;
        this.slug = params.slug;
        if (this.slug.trim() === '') {
            throw new Error('slug is required');
        }
    }
}
exports.FindPermissionBySlugDtoIn = FindPermissionBySlugDtoIn;
//# sourceMappingURL=find-permission-by-slug.dto-in.js.map