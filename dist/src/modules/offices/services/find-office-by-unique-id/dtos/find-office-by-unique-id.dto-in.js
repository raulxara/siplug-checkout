"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FindOfficeByUniqueIdDtoIn = void 0;
class FindOfficeByUniqueIdDtoIn {
    _id;
    constructor(_id) {
        this._id = _id;
        if (this._id.trim() === '') {
            throw new Error('_id is required');
        }
    }
}
exports.FindOfficeByUniqueIdDtoIn = FindOfficeByUniqueIdDtoIn;
//# sourceMappingURL=find-office-by-unique-id.dto-in.js.map