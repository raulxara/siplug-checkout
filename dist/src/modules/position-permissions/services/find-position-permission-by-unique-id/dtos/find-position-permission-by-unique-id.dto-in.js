"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FindPositionPermissionByUniqueIdDtoIn = void 0;
class FindPositionPermissionByUniqueIdDtoIn {
    _id;
    constructor(_id) {
        this._id = _id;
        if (this._id.trim() === '') {
            throw new Error('_id is required');
        }
    }
}
exports.FindPositionPermissionByUniqueIdDtoIn = FindPositionPermissionByUniqueIdDtoIn;
//# sourceMappingURL=find-position-permission-by-unique-id.dto-in.js.map