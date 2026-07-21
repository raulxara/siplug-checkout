"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FindGatewayByUniqueIdDtoIn = void 0;
class FindGatewayByUniqueIdDtoIn {
    _id;
    constructor(_id) {
        this._id = _id;
        if (this._id.trim() === '') {
            throw new Error('_id is required');
        }
    }
}
exports.FindGatewayByUniqueIdDtoIn = FindGatewayByUniqueIdDtoIn;
//# sourceMappingURL=find-gateway-by-unique-id.dto-in.js.map