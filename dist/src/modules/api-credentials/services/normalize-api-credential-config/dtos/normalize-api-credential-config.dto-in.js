"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NormalizeApiCredentialConfigDtoIn = void 0;
class NormalizeApiCredentialConfigDtoIn {
    slug;
    config;
    constructor(params) {
        this.slug = params.slug;
        this.config = params.config ?? null;
        if (this.slug.trim() === '') {
            throw new Error('slug is required');
        }
    }
}
exports.NormalizeApiCredentialConfigDtoIn = NormalizeApiCredentialConfigDtoIn;
//# sourceMappingURL=normalize-api-credential-config.dto-in.js.map