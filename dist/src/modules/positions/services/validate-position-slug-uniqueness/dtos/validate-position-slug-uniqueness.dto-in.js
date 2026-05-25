"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidatePositionSlugUniquenessDtoIn = void 0;
class ValidatePositionSlugUniquenessDtoIn {
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
exports.ValidatePositionSlugUniquenessDtoIn = ValidatePositionSlugUniquenessDtoIn;
//# sourceMappingURL=validate-position-slug-uniqueness.dto-in.js.map