"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListApiCredentialByOfficeIdDtoIn = void 0;
class ListApiCredentialByOfficeIdDtoIn {
    officeId;
    constructor(params) {
        this.officeId = String(params.officeId ?? '').trim();
        if (this.officeId === '') {
            throw new Error('officeId is required');
        }
    }
}
exports.ListApiCredentialByOfficeIdDtoIn = ListApiCredentialByOfficeIdDtoIn;
//# sourceMappingURL=list-api-credential-by-office-id.dto-in.js.map