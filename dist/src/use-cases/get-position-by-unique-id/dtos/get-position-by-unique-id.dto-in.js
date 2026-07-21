"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetPositionByUniqueIdDtoIn = void 0;
class GetPositionByUniqueIdDtoIn {
    positionId;
    constructor(params) {
        this.positionId = String(params.positionId ?? params._id ?? '').trim();
        if (this.positionId === '') {
            throw new Error('positionId is required');
        }
    }
}
exports.GetPositionByUniqueIdDtoIn = GetPositionByUniqueIdDtoIn;
//# sourceMappingURL=get-position-by-unique-id.dto-in.js.map