"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FindOfficeBySlugDtoIn = void 0;
class FindOfficeBySlugDtoIn {
    slug;
    constructor(slug) {
        this.slug = slug;
        if (this.slug.trim() === '') {
            throw new Error('slug is required');
        }
    }
}
exports.FindOfficeBySlugDtoIn = FindOfficeBySlugDtoIn;
//# sourceMappingURL=find-office-by-slug.dto-in.js.map