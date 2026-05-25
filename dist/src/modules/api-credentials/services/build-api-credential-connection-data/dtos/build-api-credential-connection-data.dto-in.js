"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BuildApiCredentialConnectionDataDtoIn = void 0;
class BuildApiCredentialConnectionDataDtoIn {
    slug;
    constructor(slug) {
        this.slug = slug;
        if (this.slug.trim() === '') {
            throw new Error('slug is required');
        }
    }
}
exports.BuildApiCredentialConnectionDataDtoIn = BuildApiCredentialConnectionDataDtoIn;
//# sourceMappingURL=build-api-credential-connection-data.dto-in.js.map