"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FindUserAccessCodeByUniqueIdDtoIn = void 0;
class FindUserAccessCodeByUniqueIdDtoIn {
    _id;
    constructor(_id) {
        this._id = _id;
        if (this._id.trim() === '') {
            throw new Error('_id is required');
        }
    }
}
exports.FindUserAccessCodeByUniqueIdDtoIn = FindUserAccessCodeByUniqueIdDtoIn;
//# sourceMappingURL=find-user-access-code-by-unique-id.dto-in.js.map