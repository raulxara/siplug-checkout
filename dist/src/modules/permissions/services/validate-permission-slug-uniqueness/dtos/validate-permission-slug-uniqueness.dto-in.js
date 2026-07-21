"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidatePermissionSlugUniquenessDtoIn = void 0;
class ValidatePermissionSlugUniquenessDtoIn {
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
exports.ValidatePermissionSlugUniquenessDtoIn = ValidatePermissionSlugUniquenessDtoIn;
//# sourceMappingURL=validate-permission-slug-uniqueness.dto-in.js.map