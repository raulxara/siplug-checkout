"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FindPermissionByUniqueIdDtoIn = void 0;
class FindPermissionByUniqueIdDtoIn {
    _id;
    constructor(_id) {
        this._id = _id;
        if (this._id.trim() === '') {
            throw new Error('_id is required');
        }
    }
}
exports.FindPermissionByUniqueIdDtoIn = FindPermissionByUniqueIdDtoIn;
//# sourceMappingURL=find-permission-by-unique-id.dto-in.js.map