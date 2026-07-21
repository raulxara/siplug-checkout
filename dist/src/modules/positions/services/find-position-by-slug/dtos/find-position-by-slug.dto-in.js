"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FindPositionBySlugDtoIn = void 0;
class FindPositionBySlugDtoIn {
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
exports.FindPositionBySlugDtoIn = FindPositionBySlugDtoIn;
//# sourceMappingURL=find-position-by-slug.dto-in.js.map