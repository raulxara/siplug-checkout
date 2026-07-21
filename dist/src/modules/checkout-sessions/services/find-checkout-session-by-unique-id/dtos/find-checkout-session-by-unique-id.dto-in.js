"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FindCheckoutSessionByUniqueIdDtoIn = void 0;
class FindCheckoutSessionByUniqueIdDtoIn {
    _id;
    constructor(_id) {
        this._id = _id;
        if (this._id.trim() === '') {
            throw new Error('_id is required');
        }
    }
}
exports.FindCheckoutSessionByUniqueIdDtoIn = FindCheckoutSessionByUniqueIdDtoIn;
//# sourceMappingURL=find-checkout-session-by-unique-id.dto-in.js.map