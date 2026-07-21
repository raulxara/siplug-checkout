"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FindClientByUniqueIdDtoIn = void 0;
class FindClientByUniqueIdDtoIn {
    _id;
    constructor(_id) {
        this._id = _id;
        if (this._id.trim() === '') {
            throw new Error('_id is required');
        }
    }
}
exports.FindClientByUniqueIdDtoIn = FindClientByUniqueIdDtoIn;
//# sourceMappingURL=find-client-by-unique-id.dto-in.js.map