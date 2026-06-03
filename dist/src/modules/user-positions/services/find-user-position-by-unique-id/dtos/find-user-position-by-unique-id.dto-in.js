"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FindUserPositionByUniqueIdDtoIn = void 0;
class FindUserPositionByUniqueIdDtoIn {
    _id;
    constructor(_id) {
        this._id = _id;
        if (this._id.trim() === '') {
            throw new Error('_id is required');
        }
    }
}
exports.FindUserPositionByUniqueIdDtoIn = FindUserPositionByUniqueIdDtoIn;
//# sourceMappingURL=find-user-position-by-unique-id.dto-in.js.map