"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FindApiCredentialByUniqueIdDtoIn = void 0;
class FindApiCredentialByUniqueIdDtoIn {
    _id;
    constructor(_id) {
        this._id = _id;
        if (this._id.trim() === '') {
            throw new Error('_id is required');
        }
    }
}
exports.FindApiCredentialByUniqueIdDtoIn = FindApiCredentialByUniqueIdDtoIn;
//# sourceMappingURL=find-api-credential-by-unique-id.dto-in.js.map