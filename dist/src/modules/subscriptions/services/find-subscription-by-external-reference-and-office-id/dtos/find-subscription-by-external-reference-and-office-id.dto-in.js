"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FindSubscriptionByExternalReferenceAndOfficeIdDtoIn = void 0;
class FindSubscriptionByExternalReferenceAndOfficeIdDtoIn {
    externalReference;
    officeId;
    constructor(params) {
        if (!params.externalReference || params.externalReference.trim() === '') {
            throw new Error('externalReference is required');
        }
        if (!params.officeId || params.officeId.trim() === '') {
            throw new Error('officeId is required');
        }
        this.externalReference = params.externalReference.trim();
        this.officeId = params.officeId.trim();
    }
}
exports.FindSubscriptionByExternalReferenceAndOfficeIdDtoIn = FindSubscriptionByExternalReferenceAndOfficeIdDtoIn;
//# sourceMappingURL=find-subscription-by-external-reference-and-office-id.dto-in.js.map