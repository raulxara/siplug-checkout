"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FindPositionByUniqueIdDtoIn = void 0;
class FindPositionByUniqueIdDtoIn {
    _id;
    constructor(_id) {
        this._id = _id;
        if (this._id.trim() === '') {
            throw new Error('_id is required');
        }
    }
}
exports.FindPositionByUniqueIdDtoIn = FindPositionByUniqueIdDtoIn;
//# sourceMappingURL=find-position-by-unique-id.dto-in.js.map