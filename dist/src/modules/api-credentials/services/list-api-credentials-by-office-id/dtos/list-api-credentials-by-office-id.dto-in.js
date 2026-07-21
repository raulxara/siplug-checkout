"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListApiCredentialsByOfficeIdDtoIn = void 0;
class ListApiCredentialsByOfficeIdDtoIn {
    officeId;
    constructor(params) {
        this.officeId = String(params.officeId ?? '').trim();
        if (this.officeId === '') {
            throw new Error('officeId is required');
        }
    }
}
exports.ListApiCredentialsByOfficeIdDtoIn = ListApiCredentialsByOfficeIdDtoIn;
//# sourceMappingURL=list-api-credentials-by-office-id.dto-in.js.map