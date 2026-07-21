"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetAllPermissionsByUniqueIdsDtoIn = void 0;
class GetAllPermissionsByUniqueIdsDtoIn {
    _ids;
    constructor(_ids) {
        this._ids = _ids;
        if (!Array.isArray(this._ids) || this._ids.length === 0) {
            throw new Error('_ids is required');
        }
        for (const _id of this._ids) {
            if (_id.trim() === '') {
                throw new Error('_ids contains invalid value');
            }
        }
    }
}
exports.GetAllPermissionsByUniqueIdsDtoIn = GetAllPermissionsByUniqueIdsDtoIn;
//# sourceMappingURL=get-all-permissions-by-unique-ids.dto-in.js.map