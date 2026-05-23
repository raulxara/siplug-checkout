"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FindProfileByDocumentDtoIn = void 0;
class FindProfileByDocumentDtoIn {
    documentType;
    documentValue;
    constructor(params) {
        this.documentType = params.documentType;
        this.documentValue = params.documentValue;
        if (this.documentType.trim() === '') {
            throw new Error('documentType is required');
        }
        if (this.documentValue.trim() === '') {
            throw new Error('documentValue is required');
        }
    }
}
exports.FindProfileByDocumentDtoIn = FindProfileByDocumentDtoIn;
//# sourceMappingURL=find-profile-by-document.dto-in.js.map