"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidateApiCredentialSlugUniquenessDtoIn = void 0;
class ValidateApiCredentialSlugUniquenessDtoIn {
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
exports.ValidateApiCredentialSlugUniquenessDtoIn = ValidateApiCredentialSlugUniquenessDtoIn;
//# sourceMappingURL=validate-api-credential-slug-uniqueness.dto-in.js.map