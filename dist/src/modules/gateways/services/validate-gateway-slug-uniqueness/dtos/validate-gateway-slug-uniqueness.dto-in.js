"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidateGatewaySlugUniquenessDtoIn = void 0;
class ValidateGatewaySlugUniquenessDtoIn {
    slug;
    constructor(slug) {
        this.slug = slug;
        if (this.slug.trim() === '') {
            throw new Error('slug is required');
        }
    }
}
exports.ValidateGatewaySlugUniquenessDtoIn = ValidateGatewaySlugUniquenessDtoIn;
//# sourceMappingURL=validate-gateway-slug-uniqueness.dto-in.js.map