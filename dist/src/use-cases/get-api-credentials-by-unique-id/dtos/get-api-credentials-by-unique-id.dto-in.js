"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetApiCredentialsByUniqueIdDtoIn = void 0;
class GetApiCredentialsByUniqueIdDtoIn {
    apiCredentialId;
    constructor(params) {
        this.apiCredentialId = String(params.apiCredentialId ?? params._id ?? '').trim();
        if (this.apiCredentialId === '') {
            throw new Error('apiCredentialId is required');
        }
    }
}
exports.GetApiCredentialsByUniqueIdDtoIn = GetApiCredentialsByUniqueIdDtoIn;
//# sourceMappingURL=get-api-credentials-by-unique-id.dto-in.js.map