"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FindProfileByUniqueIdDtoIn = void 0;
class FindProfileByUniqueIdDtoIn {
    _id;
    constructor(_id) {
        this._id = _id;
        if (this._id.trim() === '') {
            throw new Error('_id is required');
        }
    }
}
exports.FindProfileByUniqueIdDtoIn = FindProfileByUniqueIdDtoIn;
//# sourceMappingURL=find-profile-by-unique-id.dto-in.js.map