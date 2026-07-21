"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FindActiveApiCredentialBySlugDtoIn = void 0;
class FindActiveApiCredentialBySlugDtoIn {
    slug;
    constructor(slug) {
        this.slug = slug;
        if (this.slug.trim() === '') {
            throw new Error('slug is required');
        }
    }
}
exports.FindActiveApiCredentialBySlugDtoIn = FindActiveApiCredentialBySlugDtoIn;
//# sourceMappingURL=find-active-api-credential-by-slug.dto-in.js.map