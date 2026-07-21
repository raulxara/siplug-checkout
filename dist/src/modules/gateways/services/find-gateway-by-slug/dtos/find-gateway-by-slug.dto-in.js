"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FindGatewayBySlugDtoIn = void 0;
class FindGatewayBySlugDtoIn {
    slug;
    constructor(slug) {
        this.slug = slug;
        if (this.slug.trim() === '') {
            throw new Error('slug is required');
        }
    }
}
exports.FindGatewayBySlugDtoIn = FindGatewayBySlugDtoIn;
//# sourceMappingURL=find-gateway-by-slug.dto-in.js.map